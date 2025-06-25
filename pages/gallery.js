import React from 'react'
import EmblaCarousel from '../components/ui/Carousel/Carousel'

const OPTIONS = { loop: true }
const SLIDE_COUNT = 29
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const App = () => (
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
)

function Gallery() {
    return (
        <div>
        <App />
        </div>
    )
}

Gallery.publicPage = true;
export default Gallery;
