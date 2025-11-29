import { ReactNode, ButtonHTMLAttributes } from 'react'
import './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary'
}

function Button({ children, variant = 'primary', ...props }: ButtonProps) {
    return (
        <button
            className={`btn btn-${variant}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
