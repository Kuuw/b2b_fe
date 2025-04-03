import React from 'react';
import { TitleProps } from './Title.types';
import { getVariantClasses, getAlignClasses } from './Title.styles';
import clsx from 'clsx';

const Title: React.FC<TitleProps> = ({
    children,
    variant = 'h1',
    className,
    align = 'left',
}) => {
    const Tag = variant;
    
    return (
        <Tag
            className={clsx(
                'text-gray-900',
                getVariantClasses(variant),
                getAlignClasses(align),
                className
            )}
        >
            {children}
        </Tag>
    );
};

export default Title; 