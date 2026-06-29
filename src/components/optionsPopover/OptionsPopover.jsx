import React from "react";
import { Sun, Moon } from 'lucide-react';
import './OptionsPopover.css';

const OptionsPopover = ({ theme, onToggleTheme}) => {
    return (
        <div className="op-popover">
            <div className="op-header">
                Opciones
            </div>
            <div className="op-row">
                <div className="op-row-label">
                    {theme === 'dark' ? <Moon size={15}/> : <Sun size={15}/>}
                    <span>{theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}</span>
                </div>

                <button className={`op-toggle ${theme === 'dark' ? 'op-toggle--active' : ''}`} 
                onClick={onToggleTheme}
                aria-label="Activar o desactivar modo oscuro"
                >
                    <span className="op-toggle-thumb"/>
                </button>
            </div>
        </div>
    );
};

export default OptionsPopover;
