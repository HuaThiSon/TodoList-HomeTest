import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

const item = {
  id: v4(),
  name: "Todo List Drag Drop",
};

const item2 = {
  id: v4(),
  name: "Todo List Delete",
};
const item3 = {
  id: v4(),
  name: "Todo List Home",
};

function App() {
  const [text, setText] = useState("");
  const [state, setState] = useState({
    tasks: {
      title: "Tasks",
      items: [item, item2],
    },
    active: {
      title: "Active Tasks",
      items: [item3],
    },
    done: {
      title: "Completed Tasks",
      items: [],
    },
  });

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }
    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      prev[source.droppableId].items.splice(source.index, 1);

      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  const addItem = () => {
    setState((prev) => {
      return {
        ...prev,
        tasks: {
          title: "Tasks",
          items: [
            {
              id: v4(),
              name: text,
            },
            ...prev.tasks.items,
          ],
        },
      };
    });

    setText("");
  };

  return (
    <div className="App">
      <div className="input">
        <input
          type="text"
          value={text}
          placeholder="Enter a Task"
          onChange={(e) => setText(e.target.value)}
          className="input__box"
        />
        <button type="submit" onClick={addItem} className="input_submit">
          Add
        </button>
      </div>
      <div className="container">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className={"column "}>
                <span className="todos__heading">{data.title}</span>
                <Droppable droppableId={key}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={"droppable-col"}
                      >
                        {data.items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided, snapshot) => {
                                console.log(snapshot);
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && "dragging"
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {el.name}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
