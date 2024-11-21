import { Draggable } from "react-beautiful-dnd";

export default function DraggableFlag({ id, index, name }) {
  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`draggableFlag w-full tracking-widest text-green-900 rounded-lg bg-[#D5ED9F] font-bold uppercase text-center ${
              snapshot.isDragging ? "isDragging" : ""
            }`}>
            {name}
          </div>
        )}
      </Draggable>
    </>
  );
}
