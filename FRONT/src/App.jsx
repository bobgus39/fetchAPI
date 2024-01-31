import { Button, CircularProgress, Pagination } from "@nextui-org/react";
import { useState, useEffect } from "react";

function App() {
  // Estados para gestionar el despliegue, carga de datos, datos, errores y la página actual
  const [deploy, setDeploy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Efecto para cargar datos cuando se despliega y la página cambia
  useEffect(() => {
    // Función para manejar la carga de datos
    const fetchData = async () => {
      try {
        setLoading(true);
        // Realizar la solicitud HTTP para obtener datos paginados
        const res = await fetch(
          `http://localhost:3000/ver-datos?page=${page}&size=${pageSize}`,
          {
            method: "GET",
          }
        );

        // Manejar el estado de carga
        if (res.ok) {
          setLoading(false);
        }

        // Manejar errores de HTTP
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        // Convertir la respuesta a formato JSON y actualizar el estado de datos
        const json = await res.json();
        console.log("json", json);
        setData(json);
      } catch (err) {
        // Manejar errores de red y actualizar el estado de errores
        console.error("Error de red", err);
        setError("Error al obtener los datos. Por favor, inténtelo de nuevo.");
      } finally {
        // Asegurarse de que el estado de carga se establezca en falso al finalizar
        setLoading(false);
      }
    };

    // Verificar si se debe cargar datos (desplegado)
    if (!deploy) {
      fetchData();
    }
  }, [deploy, page]);

  // Manejar el clic en el botón para cambiar el estado de despliegue
  const handleClick = () => {
    setDeploy((prevDeploy) => !prevDeploy);
    setError(null); // Limpiar mensajes de error al hacer clic en el botón.
  };

  // Renderizar la interfaz de usuario
  return (
    <>
      {/* Sección cuando está desplegado */}
      {deploy ? (
        <div className="flex items-center justify-center h-screen">
          <Button className="" onClick={handleClick}>
            Lista
          </Button>
        </div>
      ) : (
        // Sección cuando no está desplegado
        <div>
          {/* Sección de carga */}
          {loading && (
            <div className="flex items-center justify-center h-screen">
              <CircularProgress color="success" aria-label="Loading..." />
            </div>
          )}

          {/* Sección de error */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Sección de datos */}
          {data && (
            <div>
              <ul>
                {data && (
                  <div>
                    {/* Título de datos */}
                    <h2 className="text-2xl font-bold mb-4">
                      Datos Recibidos:
                    </h2>

                    {/* Lista de datos */}
                    <ul className="space-y-4">
                      {data.data.map((item, index) => (
                        <li
                          key={index}
                          className="border p-4 rounded shadow-md"
                        >
                          {/* Detalles de cada elemento */}
                          <h3 className="text-xl font-semibold mb-2">
                            {item.Alojamiento}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p>
                                <span className="font-semibold">
                                  Capacidad:
                                </span>{" "}
                                {item.Capacidad}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Habitaciones:
                                </span>{" "}
                                {item.Habitaciones}
                              </p>
                              <p>
                                <span className="font-semibold">Banyos:</span>{" "}
                                {item.Banyos}
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="font-semibold">
                                  SoloEmpaquetado:
                                </span>{" "}
                                {item.SoloEmpaquetado ? "Sí" : "No"}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  DiasAvisoCheckin:
                                </span>{" "}
                                {item.DiasAvisoCheckin}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  BonoTemporada:
                                </span>{" "}
                                {item.BonoTemporada ? "Sí" : "No"}
                              </p>
                            </div>
                          </div>
                          {/* ... y así sucesivamente */}
                        </li>
                      ))}
                    </ul>

                    {/* Paginación */}
                    <div className="flex justify-center items-center my-10">
                      <Pagination
                        total={10}
                        current={page}
                        onChange={(newpage) => setPage(newpage)}
                      />
                    </div>
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
