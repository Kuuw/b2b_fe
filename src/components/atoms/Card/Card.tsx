import React from 'react';
import { CardProps } from './Card.types';
import { getPaddingClasses, getElevationClasses } from './Card.styles';
import clsx from 'clsx';

const Card: React.FC<CardProps> = ({
    children,
    className,
    padding = 'medium',
    elevation = 'low',
}) => {
    return (
        <div
            className={clsx(
                'bg-white rounded-lg',
                getPaddingClasses(padding),
                getElevationClasses(elevation),
                className
            )}
        >
            {children}
        </div>
    );
};

export default Card; 