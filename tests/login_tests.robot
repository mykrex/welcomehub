*** Settings ***
Library    SeleniumLibrary

Suite Setup      Open Browser    http://localhost:3000/    chrome
Suite Teardown   Close Browser

*** Variables ***
${EMP_EMAIL}      fernandomendoza@neoris.mx
${EMP_PASS}       Temporal123!
${ADMIN_EMAIL}    valerialopez@neoris.mx
${ADMIN_PASS}     Temporal123!

*** Test Cases ***
Login Válido Redirige a Dashboard
    [Documentation]    
    Click Button     xpath=//button[text()="Inicia Sesión"]
    Wait Until Location Contains    /login         5s
    Input Text       css=input[type="email"]       ${EMP_EMAIL}
    Input Text       css=input[type="password"]    ${EMP_PASS}
    Click Button     xpath=//button[text()="Ingresar"]
    Wait Until Location Contains    /dashboard     5s
    Element Should Be Visible    xpath=//span[contains(text(),"78%")]

Login Inválido Muestra Error
    [Documentation]    
    Go To            http://localhost:3000/
    Click Button     xpath=//button[text()="Inicia Sesión"]
    Wait Until Location Contains    /login         5s
    Input Text       css=input[type="email"]       wrong@neoris.mx
    Input Text       css=input[type="password"]    wrongPass
    Click Button     xpath=//button[text()="Ingresar"]
    Element Should Be Visible       xpath=//p[contains(text(),"Correo o contraseña inválidos")]
