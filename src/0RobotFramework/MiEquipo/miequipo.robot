/*
pip install robotframework-browser
pip install playwright
python -m playwright install

Para probarlo y guardar a donde se envia
robot --outputdir src/0RobotFramework/MiEquipoResult src/0RobotFramework/0_test/miequipo.robot
... */

*** Settings ***
Library    Browser
Suite Setup    Abrir Página MiEquipo
Suite Teardown    Close Browser

*** Variables ***
${URL}    http://localhost:3000/miequipo
${EMPLOYEE_1}    Carlos Pérez
${EMPLOYEE_2}    Ana López

*** Keywords ***
Abrir Página MiEquipo
    New Browser    chromium    headless=false
    New Context
    New Page    ${URL}

*** Test Cases ***

Verificar Acceso A Pantalla Mi Equipo
    Get Title    ==    Mi Equipo
    Wait For Elements State    text=Mi equipo:    visible

Mostrar Lista De Empleados
    Wait For Elements State    text=${EMPLOYEE_1}    visible
    Wait For Elements State    text=${EMPLOYEE_2}    visible

Mostrar Métricas Al Seleccionar Un Empleado
    Click    text=${EMPLOYEE_1}
    Wait For Elements State    text=Gráfica de horas de la semana    visible
    Wait For Elements State    text=Cursos:    visible
    Wait For Elements State    text=✅ Terminados:    visible
    Wait For Elements State    text=Promedio diario:    visible

Alternar Visibilidad De Métricas
    Click    text=${EMPLOYEE_1}
    Sleep    1s
    Wait For Elements State    text=Gráfica de horas de la semana    hidden


Cambiar Empleado Mostrado
    Click    text=${EMPLOYEE_2}
    Wait For Elements State    text=✅ Terminados:    visible
