export const getPaddingClasses = (padding: string = 'medium') => {
    switch (padding) {
        case 'none':
            return 'p-0';
        case 'small':
            return 'p-4';
        case 'medium':
            return 'p-6';
        case 'large':
            return 'p-8';
        default:
            return 'p-6';
    }
};

export const getElevationClasses = (elevation: string = 'low') => {
    switch (elevation) {
        case 'none':
            return '';
        case 'low':
            return 'shadow-sm';
        case 'medium':
            return 'shadow';
        case 'high':
            return 'shadow-lg';
        default:
            return 'shadow-sm';
    }
}; 