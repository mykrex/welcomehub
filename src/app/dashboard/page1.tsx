import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5">
        <div className="text-2xl font-bold mb-8">welcome<span className="text-blue-500">Hub</span></div>
        <nav>
          <a href="#" className="flex items-center space-x-2 p-3 bg-blue-600 rounded-lg">
            <span>📊</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-3 mt-3 hover:bg-gray-700 rounded-lg">
            <span>📚</span>
            <span>Cursos</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-3 mt-3 hover:bg-gray-700 rounded-lg">
            <span>🤖</span>
            <span>NeoBot</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-scroll">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar..."
              className="p-2 rounded-lg bg-gray-700 text-white"
            />
            <div className="w-10 h-10 rounded-full bg-gray-600"></div>
          </div>
        </header>

        {/* Progreso */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold">Mi Progreso</h2>
          <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
          <span className="text-blue-400 text-sm">78% completado</span>
        </div>

        {/* Curso Reciente */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg col-span-2">
            <h3 className="text-xl font-semibold">Atención al Cliente y Ventas</h3>
            <p className="text-sm text-gray-400 mt-2">
              Este curso proporciona habilidades esenciales para interactuar...
            </p>
            <div className="mt-4 text-sm text-green-400">3 de 5 módulos completados</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg flex items-center justify-center">
            <button className="bg-blue-600 px-4 py-2 rounded-lg">Ir a Global Campus</button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h4 className="text-lg font-semibold">Mi Tiempo Promedio</h4>
            <p className="text-2xl text-orange-500">45 min</p>
            <span className="text-xs text-orange-400">⬆ 6.7% más alto que el promedio</span>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h4 className="text-lg font-semibold">Mi Puntaje Promedio</h4>
            <p className="text-2xl text-green-500">75%</p>
            <span className="text-xs text-green-400">⬇ 10.7% más bajo que el promedio</span>
          </div>
        </div>

        {/* Mis Cursos */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Mis Cursos</h4>
          {[
            { name: 'Atención al cliente y ventas', status: 'En Proceso', color: 'bg-yellow-500' },
            { name: 'Introducción a Excel', status: 'En Proceso', color: 'bg-yellow-500' },
            { name: 'Crecimiento Corporativo', status: 'Faltante', color: 'bg-red-500' },
            { name: 'Técnicas de trabajo en equipo', status: 'Faltante', color: 'bg-red-500' },
          ].map((course, index) => (
            <div key={index} className="flex justify-between items-center mb-4">
              <div>
                <h5 className="text-lg">{course.name}</h5>
                <div className="w-64 bg-gray-700 h-2 rounded-full mt-2">
                  <div className={`h-2 rounded-full ${course.color}`} style={{ width: '60%' }}></div>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm rounded-lg ${course.color}`}>{course.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
