import React from 'react';

interface ButtonsBarProps {
  isEditable: boolean;
  copyLastWeek: () => void;
  deleteAll: () => void;
  saveWeek: () => void;
}

const ButtonsBar: React.FC<ButtonsBarProps> = ({
  isEditable,
  copyLastWeek,
  deleteAll,
  saveWeek,
}) => {
  return (
    <div className={`buttons-bar ${isEditable ? '' : 'invisible-preserved'}`}>
      <button className="link-button" onClick={copyLastWeek}>
        Copiar la Semana Pasada
      </button>
      <button></button>

      <div className="button-group">
        <button></button>
        <button
          className="red"
          style={{ visibility: isEditable ? 'visible' : 'hidden' }}
          onClick={deleteAll}
        >
          Eliminar Todo
        </button>
        <button
          className="gray"
          style={{ visibility: isEditable ? 'visible' : 'hidden' }}
          onClick={saveWeek}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ButtonsBar;
