import React, { useEffect, useState } from 'react';
import { useParams, Route } from 'react-router-dom';
import axios from 'axios';
import './Publicaciones.css'

const Publicaciones = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const { categoria } = useParams();
    const [categoriaId, setCategoriaId] = useState(null);

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
          {publicaciones.filter(publicacion => publicacion.categoria_id === categoriaId).map((publicacion) => (
            <div className='Caja_publicacion' key={publicacion.id}>
              <p>User ID: {publicacion.user_id}</p>
              <p>Categoria ID: {publicacion.categoria_id}</p>
              <p>Descripcion: {publicacion.descripcion}</p>
              {publicacion.imagen && <img src={publicacion.imagen} alt="Imagen de publicación" />}
              {publicacion.video && <video src={publicacion.video} controls />}
            </div>
          ))}
        </div>
      );
    };
    
    export default Publicaciones;