type ModalProps = {
    show: boolean;
    onClose:  React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}
const Modal = ({show, onClose, children}: ModalProps) => {
 
  return (
    <div style={{
        transform: show ? "translateX(0%)" : "translateX(-200%)"
      }} className="absolute top-0 left-0 w-full h-full z-10 transition-all duration-500">
        <div className="container mx-auto max-w-2xl h-[80vh] rounded-3xl bg-slate-800 py-6 px-4">
          <button className=" h-10 w-10 rounded-full bg-slate-600 mb-4" onClick={()=>onClose(false)}>
            X
          </button>
          {children}
        </div>
      </div>
  )
}

export default Modal