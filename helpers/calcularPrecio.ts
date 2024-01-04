
const calcularPrecio = ( entrada: number = Date.now(), salida: number = Date.now(), precioBase: number = 0, precioMinuto: number = 0, desdeMinuto: number = 0 ): number => {
    const diferenciaEnMilisegundos = salida - entrada;

    // Puedes convertir la diferencia a segundos, minutos, horas, etc., según tus necesidades
    const diferenciaEnSegundos = diferenciaEnMilisegundos / 1000;
    const diferenciaEnMinutos = diferenciaEnSegundos / 60;

    const minutosRedondeados = Math.ceil(diferenciaEnMinutos)

    if ( minutosRedondeados <= desdeMinuto ) {
        return precioBase;
    }

    const precio = ((diferenciaEnMinutos - desdeMinuto) * precioMinuto) + precioBase;

    return Math.round(precio)
}


export default calcularPrecio