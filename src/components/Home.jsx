import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import appFirebase from "../credenciales";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(appFirebase);

function CocheItem({ coche, onDelete }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/test/${coche.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete();
      } else {
        const data = await response.json();
        console.error('Error al eliminar el coche:', data.error);
      }
    } catch (error) {
      console.error('Error al eliminar el coche:', error);
    }
  }

  const imagenPorDefecto = 'https://pluspng.com/img-png/car-red-png--1753.png';

  return (
    
    <div className="col-md-4">
      <div className="card">
        <img
          src={coche.Imagen || imagenPorDefecto}
          alt={`Imagen de ${coche['Nombre del coche']}`}
          className="card-img-top"
        />
        <div className="card-body">
          <h2 className="card-title text-primary">{coche['Nombre del coche']}</h2>
          <p className="card-text"><strong>Modelo:</strong> {coche.Modelo}</p>
          <p className="card-text"><strong>Kilómetros:</strong> {coche.Kilómetros}</p>
          <p className="card-text"><strong>Tipo de combustible:</strong> {coche['Tipo de combustible']}</p>
          <p className="card-text"><strong>Año:</strong> {coche.Año}</p>
          <p className="card-text"><strong>Precio:</strong> {coche.Precio}</p>
          <button onClick={handleDelete} className="btn btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [coches, setCoches] = useState([]);
  const [tipoCombustibleFiltrado, setTipoCombustibleFiltrado] = useState('');
  const [newCoche, setNewCoche] = useState({
    'Nombre del coche': '',
    Modelo: '',
    Kilómetros: '',
    'Tipo de combustible': '',
    Año: '',
    Precio: '',
    Imagen: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData(); // Load initial data
  }, []);

  const allowedImageFormats = ['image/png', 'image/jpeg', 'image/webp'];

  const handleImageUpload = (event) => {
    // Function to handle image upload
    const file = event.target.files[0];

    if (file && allowedImageFormats.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataURL = e.target.result;
        setNewCoche({
          ...newCoche,
          Imagen: imageDataURL,
        });
      };

      reader.readAsDataURL(file);
    } else {
      setErrors({ ...errors, Imagen: 'Por favor, selecciona una imagen en formato PNG, JPG o WEBP.' });
    }
  }

  const handleNewCocheChange = (event) => {
    // Function to handle changes in the fields of the new car
    const { name, value } = event.target;

    if (name === 'Kilómetros') {
      // Remove all non-numeric characters and add "Km" at the end
      const numericValue = value.replace(/[^\d]/g, '');
      const formattedKilometers = `${numericValue} Km`;

      setErrors({ ...errors, Kilómetros: '' });
      setNewCoche({
        ...newCoche,
        Kilómetros: formattedKilometers,
      });
    } else if (name === 'Año') {
      // Remove all non-numeric characters and validate that they are 4 digits
      const numericValue = value.replace(/[^\d]/g, '');

      if (numericValue.length === 4) {
        setErrors({ ...errors, Año: '' });
        setNewCoche({
          ...newCoche,
          Año: numericValue,
        });
      } else {
        setErrors({ ...errors, Año: 'Por favor, introduce un año válido de 4 dígitos (ejemplo: 2019)' });
      }
    } else if (name === 'Precio') {
      // Remove all non-numeric characters and add the euro symbol at the end
      const numericValue = value.replace(/[^\d]/g, '');
      const formattedPrice = `${numericValue} €`;

      setErrors({ ...errors, Precio: '' });
      setNewCoche({
        ...newCoche,
        Precio: formattedPrice,
      });
    } else {
      setErrors({ ...errors, [name]: '' });
      setNewCoche({
        ...newCoche,
        [name]: value,
      });
    }
  }

  const fetchData = async () => {
    // Function to load car data from the server
    try {
      const response = await fetch('http://localhost:3000/test');
      const jsonData = await response.json();
      setCoches(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const tiposCombustibleUnicos = [...new Set(coches.map(coche => coche['Tipo de combustible']))];

  const handleSelectTipoCombustibleChange = (event) => {
    // Function to change the filter by fuel type
    setTipoCombustibleFiltrado(event.target.value);
  }

  const cochesFiltrados = coches.filter(coche => !tipoCombustibleFiltrado || coche['Tipo de combustible'] === tipoCombustibleFiltrado);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCoche),
      });

      if (response.ok) {
        setNewCoche({
          'Nombre del coche': '',
          Modelo: '',
          Kilómetros: '',
          'Tipo de combustible': '',
          Año: '',
          Precio: '',
          Imagen: '',
        });

        fetchData();
      } else {
        const data = await response.json();
        const errorMessage = data && data.error ? data.error : 'Respuesta del servidor no válida';
        console.error('Error al agregar el coche:', errorMessage);
      }
    } catch (error) {
      console.error('Error al agregar el coche:', error);
    }
  }

  const handleDeleteCoche = fetchData;

  return (
    <div className="container">
      <nav class="navbar navbar-light bg-light fixed-top">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="https://artifacts-cdn.autohero.com/retail-sharding/public/assets/dark-short-7c6237f2e32b032b9b2ee1fa72b78e01.svg" alt="" width="30" height="24" class="d-inline-block align-text-top"/>
            Bootstrap
          </a>
          <button className="btn btn-primary" onClick={() => signOut(auth)}>
            Logout
          </button>
        </div>
      </nav>

      <div className="row">
        <div className="col-12"> {/* Set col-12 for the main div */}
          <h1>Coches de segunda mano</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8"> {/* Set col-8 for the div displaying cars */}
          <div className="form-group">
            <label htmlFor="tipoCombustible">Selecciona un combustible:</label>
            <select
              id="tipoCombustible"
              className="form-control"
              onChange={handleSelectTipoCombustibleChange}
              value={tipoCombustibleFiltrado}
            >
              <option value="">Todos</option>
              {tiposCombustibleUnicos.map((tipo, index) => (
                <option key={index} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <div className="row">
            {cochesFiltrados.map(coche => (
              <CocheItem key={coche.id} coche={coche} onDelete={handleDeleteCoche} />
            ))}
          </div>
        </div>
        <div className="col-md-4 position-fixed top-1 end-0"> {/* Set col-4 and sticky for the form div */}
          <h2 className="my-4">Agregar Nuevo Coche</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Coche:</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="Nombre del coche"
                value={newCoche['Nombre del coche']}
                onChange={handleNewCocheChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="modelo">Modelo:</label>
              <input
                type="text"
                className="form-control"
                id="modelo"
                name="Modelo"
                value={newCoche.Modelo}
                onChange={handleNewCocheChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="kilometros">Kilómetros:</label>
              <input
                type="text"
                className="form-control"
                id="kilometros"
                name="Kilómetros"
                value={newCoche.Kilómetros}
                onChange={handleNewCocheChange}
                required
              />
              {errors.Kilómetros && <div className="text-danger">{errors.Kilómetros}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="combustible">Tipo de Combustible:</label>
              <input
                type="text"
                className="form-control"
                id="combustible"
                name="Tipo de combustible"
                value={newCoche['Tipo de combustible']}
                onChange={handleNewCocheChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ano">Año:</label>
              <input
                type="text"
                className="form-control"
                id="ano"
                name="Año"
                value={newCoche.Año}
                onChange={handleNewCocheChange}
                required
              />
              {errors.Año && <div className="text-danger">{errors.Año}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="precio">Precio:</label>
              <input
                type="text"
                className="form-control"
                id="precio"
                name="Precio"
                value={newCoche.Precio}
                onChange={handleNewCocheChange}
                required
              />
              {errors.Precio && <div className="text-danger">{errors.Precio}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="imagen">Arrastra y suelta una imagen o haz clic para seleccionar una imagen:</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="imagen"
                name="Imagen"
                onChange={handleImageUpload}
              />
              {errors.Imagen && <div className="text-danger">{errors.Imagen}</div>}
            </div>
            <button type="submit" className="btn btn-primary">
              Agregar Coche
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
