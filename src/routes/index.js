// Pages here
import App from '../views/app'
import Salir from '../views/salir'
import Login from '../views/login/login'
import Inicio from '../views/inicio/inicio'
import Pacientes from '../views/pacientes/pacientes';
import Paciente from '../views/paciente/paciente';
import ResultadosPaciente from '../views/paciente/resultados';
import MiPerfil from '../views/perfil/perfil';
import _404 from '../views/404'
import ResultadosPacientePrivate from '../views/paciente/resultadosPrivate';
import VisorLab from '../views/visor/visorLab';
import VisorImg from '../views/visor/visorImg';
import ViewerImg from '../views/visor/viewerImg';
import VisorQR from '../views/visor/qr';
import VisorPTEQR from '../views/visor/pteQR';





// Routes here
const Routes = {
    '/': App,
    '/inicio': Inicio, //Inicio
    '/auth': Login, // Login
    '/paciente/:nhc': Paciente, // Paciente
    '/resultados/paciente/:nhc': ResultadosPacientePrivate, // Resultados de Paciente
    '/resultados': ResultadosPacientePrivate, // Resultados de Paciente
    '/resultado/l/:id': VisorLab, // VisorLab
    '/resultado/i/:id': VisorImg, // VisorImg
    '/perfil/qr/': VisorQR, // VisorQR
    '/qr/': VisorPTEQR, // VisorPTEQR
    '/viewer/:id': ViewerImg, // ViewerImg
    '/mi-perfil': MiPerfil, // MiPerfil
    '/salir': Salir, // Salir
    "/:404...": _404
};

const DefaultRoute = '/';

export { Routes, DefaultRoute }