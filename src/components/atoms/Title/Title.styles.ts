export const getVariantClasses = (variant: string = 'h1') => {
    switch (variant) {
        case 'h1':
            return 'text-4xl font-bold';
        case 'h2':
            return 'text-3xl font-bold';
        case 'h3':
            return 'text-2xl font-semibold';
        case 'h4':
            return 'text-xl font-semibold';
        case 'h5':
            return 'text-lg font-medium';
        case 'h6':
            return 'text-base font-medium';
        default:
            return 'text-4xl font-bold';
    }
};

export const getAlignClasses = (align: string = 'left') => {
    switch (align) {
        case 'left':
            return 'text-left';
        case 'center':
            return 'text-center';
        case 'right':
            return 'text-right';
        default:
            return 'text-left';
    }
}; 