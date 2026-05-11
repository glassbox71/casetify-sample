import React from 'react'
import "./scss/SectionTitle.scss"

export default function SectionTitle({ title, subtitle, subLink }) {
    return (
        <div className="section-title-box">
            <h2 className="section-title">{title}</h2>

            {subtitle && (
                <p className="section-sub-title">
                    {subLink ? (
                        <a
                            href={subLink}
                            className="section-sub-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {subtitle}
                        </a>
                    ) : (
                        subtitle
                    )}
                </p>
            )}
        </div>
    )
}