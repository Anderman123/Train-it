import React, { useEffect, useState } from 'react';
import { useParams, Route } from 'react-router-dom';
import ModalImage from "react-modal-image";
import axios from 'axios';
import './Publicaciones.css';

const Publicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const { categoria } = useParams();
  const [editandoPostId, setEditandoPostId] = useState(null);
  const [video, setVideo] = useState("");
  const [imagen, setImagen] = useState(null);

  

  const userId = localStorage.getItem('userId'); // Recupera el ID del usuario
  const userRole = localStorage.getItem('userRole'); // Recupera el ID del usuario
  console.log(userId);
  console.log(userRole);
  console.log(userRole);
  console.log(userRole);

  const [descripcion, setDescripcion] = useState("");

  // Verificar autenticación
  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }
  }, [history]);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}`);
      // Actualizar las publicaciones después de borrar una
      setPublicaciones(publicaciones.filter(publicacion => publicacion.id !== postId));
    } catch (error) {
      console.error('Hubo un error al borrar la publicación', error);
    }
  };



  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("categoria_id", categoriaId);
    formData.append("descripcion", descripcion);
    formData.append("video", video);
    if (imagen) {
      formData.append("imagen", imagen);
    }
  
    if (editandoPostId) {
      try {
        // Si estás editando, haz una solicitud PUT en lugar de POST
        await axios.put(`http://127.0.0.1:8000/api/posts/${editandoPostId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // Recarga la página o actualiza el estado para reflejar los cambios
        window.location.reload();
      } catch (error) {
        console.error('Hubo un error al editar la publicación', error);
      }
    } else {
      try {
        await axios.post('http://127.0.0.1:8000/api/posts', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
    
        window.location.reload();
      } catch (error) {
        console.error('Hubo un error al crear la publicación', error);
      }
    }
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/usuario');
        setUsuarios(response.data.data);
      } catch (error) {
        console.error('Hubo un error al obtener los datos del usuario', error);
      }
    };

    fetchUsuario();
  }, []);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categorias');
        const categorias = response.data;

        const categoriaEncontrada = categorias.find(cat => cat.nombre === categoria);
        if (categoriaEncontrada) {
          setCategoriaId(categoriaEncontrada.id);
        } else {
          console.log('Categoría no encontrada');
        }
      } catch (error) {
        console.error('Hubo un error al obtener las categorías', error);
      }
    };

    fetchCategoria();
  }, [categoria]);

  useEffect(() => {
      const fetchData = async () => {
          const response = await axios.get('http://127.0.0.1:8000/api/posts');
          setPublicaciones(response.data);

          if(response.data.length > 0) {
              console.log(response.data);
          } else {
              console.log('No hay publicaciones disponibles');
          }
      };

      fetchData();
  }, []);

  // Función para transformar la URL de YouTube a URL de embed
  const getEmbedUrl = (url) => {
    if (!url) return url;

    try {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return url; // Si no se puede transformar la URL, devolver la URL original
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleFormSubmit}>
          <textarea 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Escribe tu publicación aquí"
          />
          <input 
            type="text" 
            value={video} 
            onChange={(e) => setVideo(e.target.value)} 
            placeholder="URL del video" 
          />
          <input
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
            accept="image/*"
          />
          

          <button className='boton' type="submit">Publicar</button>
        </form>
      </div>

      {publicaciones.filter(publicacion => publicacion.categoria_id === categoriaId).map((publicacion) => {
        const usuarioPublicacion = usuarios.find(usuario => usuario.id === publicacion.user_id);
        const embedUrl = getEmbedUrl(publicacion.video);

        return (
          <div className='Caja_publicacion' key={publicacion.id}>
            {publicacion.imagen && 
              <ModalImage 
                className='img_post'
                small={publicacion.imagen} 
                large={publicacion.imagen} 
                alt="Imagen de publicación" 
              />
            }

            {/* {publicacion.video && <video src={publicacion.video} controls />} */}
            {embedUrl && <iframe className='vid_post' src={embedUrl} title="Video de publicación" allowFullScreen />}

            
            <div className='Caja_descripcion'>
              {usuarioPublicacion && <p>@:{usuarioPublicacion.name}</p>}
              <p>Nombre de la categoria: {categoria}</p>
              <p>Descripcion: {publicacion.descripcion}</p>
            </div>

            {/* Solo muestra el botón de borrar si el usuario es el propietario de la publicación */}
            {(userRole === 'admin' || publicacion.user_id === Number(userId)) && (
              <>
                <button onClick={() => handleDeletePost(publicacion.id)}>Borrar post</button>
                <button onClick={() => {
                  setEditandoPostId(publicacion.id);
                  setDescripcion(publicacion.descripcion);
                  window.scrollTo(0, 0);
                }}>Editar post</button>
              </>
            )}

          </div>
        );
      })}
    </div>
  );
};

export default Publicaciones;