export default function ConfirmModal({ qubitId, onCancel, onConfirm }) {
  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete Q[{qubitId}]?</h3>
        <p>
          This removes the qubit and all gates on its lane. The circuit will
          recompute.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} type="button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
