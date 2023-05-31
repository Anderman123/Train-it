import React, { useEffect, useState } from 'react';
import { useParams, Route } from 'react-router-dom';
import axios from 'axios';
import './Publicaciones.css';

const Publicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const { categoria } = useParams();
  const [editandoPostId, setEditandoPostId] = useState(null);

  

  const userId = localStorage.getItem('userId'); // Recupera el ID del usuario
  const userRole = localStorage.getItem('userRole'); // Recupera el ID del usuario
  console.log(userId);
  console.log(userRole);
  console.log(userRole);
  console.log(userRole);

  const [descripcion, setDescripcion] = useState("");


  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}`);
      // Actualizar las publicaciones después de borrar una
      setPublicaciones(publicaciones.filter(publicacion => publicacion.id !== postId));
    } catch (error) {
      console.error('Hubo un error al borrar la publicación', error);
    }
  };

  const handleEditPost = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/posts/${editandoPostId}`, {
        descripcion: descripcion
      });
  
      // Actualizar las publicaciones después de editar una
      const actualizadasPublicaciones = publicaciones.map(publicacion => 
        publicacion.id === editandoPostId ? {...publicacion, descripcion: descripcion} : publicacion
      );
      setPublicaciones(actualizadasPublicaciones);
  
      // Resetear los estados
      setEditandoPostId(null);
      setDescripcion('');
    } catch (error) {
      console.error('Hubo un error al editar la publicación', error);
    }
  };
  


  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    if (editandoPostId) {
      handleEditPost();
    } else {
      try {
        await axios.post('http://127.0.0.1:8000/api/posts', {
          user_id: userId,
          categoria_id: categoriaId,
          descripcion: descripcion
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

  return (
    <div>
      <div>
        <form onSubmit={handleFormSubmit}>
          <textarea 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Escribe tu publicación aquí"
          />

          <button type="submit">Publicar</button>
        </form>
      </div>

      {publicaciones.filter(publicacion => publicacion.categoria_id === categoriaId).map((publicacion) => {
        // Busca al usuario con el mismo id que publicacion.user_id
        const usuarioPublicacion = usuarios.find(usuario => usuario.id === publicacion.user_id);

        return (
          <div className='Caja_publicacion' key={publicacion.id}>
            {publicacion.imagen && <img src={publicacion.imagen} alt="Imagen de publicación" />}
            {publicacion.video && <video src={publicacion.video} controls />}

            {usuarioPublicacion && <p>@:{usuarioPublicacion.name}</p>}
            
            <div className='Caja_descripcion'>
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