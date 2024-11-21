import { Droppable } from "react-beautiful-dnd";
import StaticFlag from "./StaticFlag";

export default function SilhouetteColumn({ id, imageUrl, flag, name }) {
  return (
    <>
      <Droppable droppableId={id}>
        {(provided) => (
          <figure
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="silhouetteColumn border-8 h-50 w- bg-green-900 border-green-900 rounded-lg "
            style={{ backgroundImage: `url(${imageUrl})` }}>
            {flag.length === 1 ? (
              <>
                {flag.map((flag) => (
                  <StaticFlag key={flag.id} name={flag.name} />
                ))}
              </>
            ) : null}
            {provided.placeholder}
          </figure>
        )}
      </Droppable>
    </>
  );
}
