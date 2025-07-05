import React from 'react'

function Footer() {
    return (
        <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
        </footer>
    )
}

export default Footer