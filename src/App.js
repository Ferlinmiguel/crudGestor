import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function App() {
  const baseUrl = "https://localhost:7281/api/gestores";
  const [data, setData] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [gestorSeleccionado, setGestorSeleccionado] = useState({
    id: "",
    nombre: "",
    lanzamiento: "",
    desarrollador: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGestorSeleccionado({
      ...gestorSeleccionado,
      [name]: value,
    });
    //mostrar en consola lo que typea el usuario, para así ver lo que es enviado a la api.
    console.log(gestorSeleccionado);
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const peticionGet = async () => {
    await axios
      .get(baseUrl)
      //Si la respuesta es exitosa
      .then((response) => {
        //que se guarde en el estado
        setData(response.data);
        //si no lo es, que envíe un error
      })
      .catch((error) => {
        //imprime dicho error en consola
        console.log(error);
      });
  };

  const peticionPost = async () => {
    //eliminamos el atributo ID
    delete gestorSeleccionado.id;
    //convertimos el lanzamiento de string a entero
    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento);
    //hacemos la petición, pasándole la url y el gestor seleccionado
    await axios
      .post(baseUrl, gestorSeleccionado)
      //Si la respuesta es exitosa
      .then((response) => {
        //agregamos al estado
        setData(data.concat(response.data));
        //cerrar el modal luego de insertar
        abrirCerrarModalInsertar();
        //si no lo es, que envíe un error
      })
      .catch((error) => {
        //imprime dicho error en consola
        console.log(error);
      });
  };

  const peticionPut = async () => {
    //convertimos el lanzamiento de string a entero
    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento);
    await axios
      .put(baseUrl + "/" + gestorSeleccionado.id, gestorSeleccionado)
      .then((response) => {
        var respuesta = response.data;
        var dataAuxiliar = data;
        dataAuxiliar.map((gestor) => {
          if (gestor.id === gestorSeleccionado.id) {
            gestor.nombre = respuesta.nombre;
            gestor.lanzamiento = respuesta.lanzamiento;
            gestor.desarrollador = respuesta.desarrollador;
          }
        });
        abrirCerrarModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionDelete = async () => {
    //mandamos llamar la petición delete y le pasamos la url, a esta le concatenamos una diagonal y el id que estamos seleccionando
    await axios
      .delete(baseUrl + "/" + gestorSeleccionado.id)
      //si la respuesta es exitosa
      .then((response) => {
        //hacemos un filtro de la data y eliminamos el registro que coincida con el id que nos retorna la api
        setData(data.filter((gestor) => gestor.id !== response.data));
        //finalmente, cerramos la ventana modal
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const seleccionarGestor = (gestor, caso) => {
    setGestorSeleccionado(gestor);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  //mandamos a llamar dicha petición dentro del useEfect()
  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div className="App">
      <button
        className="btn btn-success my-5"
        onClick={() => abrirCerrarModalInsertar()}
      >
        Insertar nuevo Gestor
      </button>
      <table className="table table-bordered table-responsive">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Lanzamiento</th>
            <th scope="col">Desarrollador</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((gestor) => (
            <tr>
              <td>{gestor.id}</td>
              <td>{gestor.nombre}</td>
              <td>{gestor.lanzamiento}</td>
              <td>{gestor.desarrollador}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => seleccionarGestor(gestor, "Editar")}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => seleccionarGestor(gestor, "Eliminar")}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ESTE ES EL MODAL PARA INSERTAR */}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Gestor de Base de Datos</ModalHeader>
        <ModalBody>
          <div className="form-group ">
            <div className="my-4 form-floating">
              <input
                type="text"
                className="form-control"
                name="nombre"
                onChange={handleChange}
                placeholder="Nombre"
              />
              <label>Nombre</label>
            </div>

            <div className="my-4 form-floating">
              <input
                type="text"
                className="form-control"
                name="lanzamiento"
                onChange={handleChange}
                placeholder="Lanzamiento"
              />
              <label>Lanzamiento</label>
            </div>

            <div className="my-4 form-floating">
              <input
                type="text"
                className="form-control"
                name="desarrollador"
                onChange={handleChange}
                placeholder="Desarrollador"
              />
              <label>Desarrollador</label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()}>
            Insertar
          </button>
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalInsertar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/* ESTE ES EL MODAL PARA EDITAR */}
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Gestor de Base de Datos</ModalHeader>
        <ModalBody>
          <div className="form-group ">
            <div className="my-4 form-floating">
              <input
                type="text"
                className="form-control"
                name="id"
                onChange={handleChange}
                readOnly
                placeholder="Id"
                value={gestorSeleccionado && gestorSeleccionado.id}
              />
              <label>Id</label>
            </div>

            <div className="my-4 form-floating">
              <input
                type="text"
                className="form-control"
                name="nombre"
                onChange={handleChange}
                placeholder="Nombre"
                value={gestorSeleccionado && gestorSeleccionado.nombre}
              />
              <label>Nombre</label>
            </div>

            <div className="my-4 form-floating">
              <input
                type="text"
                className="form-control"
                name="lanzamiento"
                onChange={handleChange}
                placeholder="Lanzamiento"
                value={gestorSeleccionado && gestorSeleccionado.lanzamiento}
              />
              <label>Lanzamiento</label>
            </div>

            <div className="my-4 form-floating">
              <input
                type="text"
                className="form-control"
                name="desarrollador"
                onChange={handleChange}
                placeholder="Desarrollador"
                value={gestorSeleccionado && gestorSeleccionado.desarrollador}
              />
              <label>Desarrollador</label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPut()}>
            Editar
          </button>
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/* ESTE ES EL MODAL PARA ELIMINAR */}
      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Estás seguro que deseas eliminar el gestor de base de datos{"-"}
          {gestorSeleccionado && gestorSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
