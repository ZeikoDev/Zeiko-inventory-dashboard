export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Validaciones para empresas
export const validateCompany = (data: {
    nit: string;
    name: string;
    address: string;
    phone: string;
}) => {
    if (!data.nit || data.nit.trim().length === 0) {
        throw new ValidationError('El NIT es requerido');
    }
    if (!data.name || data.name.trim().length === 0) {
        throw new ValidationError('El nombre de la empresa es requerido');
    }
    if (!data.address || data.address.trim().length === 0) {
        throw new ValidationError('La dirección es requerida');
    }
    if (!data.phone || data.phone.trim().length === 0) {
        throw new ValidationError('El teléfono es requerido');
    }
    // Validar formato de NIT (ejemplo: solo números y guiones)
    if (!/^[0-9-]+$/.test(data.nit)) {
        throw new ValidationError('El NIT solo debe contener números y guiones');
    }
    // Validar formato de teléfono (ejemplo: números, espacios, paréntesis y guiones)
    if (!/^[0-9\s()+-]+$/.test(data.phone)) {
        throw new ValidationError('El teléfono tiene un formato inválido');
    }
};

// Validaciones para productos
export const validateProduct = (data: {
    code: string;
    name: string;
    characteristics: string;
    price_usd: number;
    price_eur: number;
    price_cop: number;
    company: number;
}) => {
    if (!data.code || data.code.trim().length === 0) {
        throw new ValidationError('El código del producto es requerido');
    }
    if (!data.name || data.name.trim().length === 0) {
        throw new ValidationError('El nombre del producto es requerido');
    }
    if (!data.characteristics || data.characteristics.trim().length === 0) {
        throw new ValidationError('Las características del producto son requeridas');
    }
    if (data.price_usd <= 0) {
        throw new ValidationError('El precio en USD debe ser mayor a 0');
    }
    if (data.price_eur <= 0) {
        throw new ValidationError('El precio en EUR debe ser mayor a 0');
    }
    if (data.price_cop <= 0) {
        throw new ValidationError('El precio en COP debe ser mayor a 0');
    }
    if (!data.company) {
        throw new ValidationError('Debe seleccionar una empresa');
    }
};

// Validaciones para inventario
export const validateInventory = (data: {
    product: number;
    company: number;
    quantity: number;
}) => {
    if (!data.product) {
        throw new ValidationError('Debe seleccionar un producto');
    }
    if (!data.company) {
        throw new ValidationError('Debe seleccionar una empresa');
    }
    if (data.quantity < 0) {
        throw new ValidationError('La cantidad no puede ser negativa');
    }
    if (!Number.isInteger(data.quantity)) {
        throw new ValidationError('La cantidad debe ser un número entero');
    }
};

// Validaciones para autenticación
export const validateLogin = (data: {
    username: string;
    password: string;
}) => {
    if (!data.username || data.username.trim().length === 0) {
        throw new ValidationError('El nombre de usuario es requerido');
    }
    if (!data.password || data.password.trim().length === 0) {
        throw new ValidationError('La contraseña es requerida');
    }
    if (data.password.length < 8) {
        throw new ValidationError('La contraseña debe tener al menos 8 caracteres');
    }
}; 