interface tituloProps{
    title: string;
}

const Titulo: React.FC<tituloProps> = ({title}) => {
    return (
        <h2 className="text-white text-lg bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-2 rounded-tl-2xl rounded-br-2xl font-semibold w-fit mb-4">{title}</h2>
    );
};

export default Titulo;