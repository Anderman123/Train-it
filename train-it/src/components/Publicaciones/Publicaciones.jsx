import React, { useEffect, useState } from 'react';
import { useParams, Route } from 'react-router-dom';
import axios from 'axios';
import './Publicaciones.css';


const Publicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const { categoria } = useParams();

  const [userId, setUserId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    try {
      await axios.post('http://127.0.0.1:8000/api/posts', {
        user_id: userId,
        categoria_id: categoriaId,
        descripcion: descripcion
      });
      // Aquí puedes agregar una función para actualizar las publicaciones
      // tras agregar una nueva
      // Por ejemplo:
      // fetchPublicaciones();
      window.location.reload();
    } catch (error) {
      console.error('Hubo un error al crear la publicación', error);
    }
  };
  

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/usuario');
        // Aquí estamos estableciendo el primer usuario de la lista.
        setUsuarios(response.data.data);
      } catch (error) {
        console.error('Hubo un error al obtener los datos del usuario', error);
      }
    };
    fetchUsuario();
  }, []);
  // console.log(usuario.id);
  // console.log(usuario.name);
  // console.log(usuarios);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categorias');
        const categorias = response.data;

        // Busca la categoría que coincide con la URL
        const categoriaEncontrada = categorias.find(cat => cat.nombre === categoria);
        if (categoriaEncontrada) {
          // Guarda el ID de la categoría que coincide
          setCategoriaId(categoriaEncontrada.id);
        } else {
          console.log('Categoría no encontrada');
        }
      } catch (error) {
        console.error('Hubo un error al obtener las categorías', error);
      }
    };
    fetchCategoria();
  }, [categoria]);  // Dependencia en 'categoria' para que se ejecute de nuevo si cambia
  // console.log(categoriaId);
  // console.log(categoriaId);
  // console.log(categoriaId);


  
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
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.name}
              </option>
            ))}
          </select>

          <textarea 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Escribe tu publicación aquí"
          />

          <button type="submit">Publicar</button>
        </form>

        {/* Aquí va el resto de tu JSX */}
      </div>
      {/* <div className='Caja_publicacion'>
          {usuarios.map(usuario => (
            <p key={usuario.id}>{usuario.id}: {usuario.name}</p>
          ))}
      </div> */}

      {publicaciones.filter(publicacion => publicacion.categoria_id === categoriaId).map((publicacion) => {
        // Busca al usuario con el mismo id que publicacion.user_id
        const usuarioPublicacion = usuarios.find(usuario => usuario.id === publicacion.user_id);

        return (
          <div className='Caja_publicacion' key={publicacion.id}>
            {/* <p>User ID: {publicacion.user_id}</p> */}
            {/* Si se encontró el usuario, muestra su nombre */}
            {publicacion.imagen && <img src={publicacion.imagen} alt="Imagen de publicación" />}
            {publicacion.video && <video src={publicacion.video} controls />}

            {usuarioPublicacion && <p>@:{usuarioPublicacion.name}</p>}
            
            <div className='Caja_descripcion'>
              <p>Categoria ID: {publicacion.categoria_id}</p>
              <p>Descripcion: {publicacion.descripcion}</p>
            </div>

          </div>
        );
      })}
    </div>
  );
};
    
export default Publicaciones;