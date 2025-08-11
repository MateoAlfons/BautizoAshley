"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, Phone, Heart, Baby, ChevronLeft, ChevronRight, Volume2, VolumeX, Church, Wine } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Función para convertir URLs de Google Drive compartidas a URLs directas
function convertGoogleDriveUrl(url: string): string {
  // Si ya es una URL directa, la devolvemos tal como está
  if (url.includes('uc?export=view&id=')) {
    return url
  }
  
  // Si es una URL de compartir de Google Drive, extraemos el ID
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }
  
  // Si no es una URL de Google Drive, la devolvemos tal como está
  return url
}

export default function BautizoAshley() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [adultos, setAdultos] = useState<number>(0)
  const [ninos, setNinos] = useState<number>(0)
  const [nombresAdultos, setNombresAdultos] = useState<string[]>([])
  const [nombresNinos, setNombresNinos] = useState<string[]>([])
  const [mensaje, setMensaje] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isMobile = useIsMobile()

  // Lista de imágenes locales del carousel
  const galleryImages = [
    '/carrusel/ash0.jpeg',
    '/carrusel/ash1.jpeg',
    '/carrusel/ash2.jpeg',
    '/carrusel/ash3.jpeg',
    '/carrusel/ash4.jpeg',
    '/carrusel/ash5.jpeg',
    '/carrusel/ash6.jpeg',
    '/carrusel/ash7.jpeg',
    '/carrusel/ash8.jpeg',
    '/carrusel/ash9.jpeg',
    '/carrusel/ash10.jpeg',
    '/carrusel/ash11.jpeg',
    '/carrusel/ash12.jpeg',
    '/carrusel/ash13.jpeg',
    '/carrusel/ash14.jpeg'
  ]

  // Autoplay del carousel
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        return prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      })
    }, 2000) // Cambiar cada 2 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [galleryImages.length])

  // Funciones para navegación manual
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => {
      return prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    })
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => {
      return prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    })
  }

  // Función para controlar reproducción de audio
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  // Inicialización del audio
  useEffect(() => {
    if (audioRef.current && !audioInitialized) {
      audioRef.current.volume = 0.5 // Volumen al 50%
      setAudioInitialized(true)
      
      // Función para iniciar audio en la primera interacción
      const startAudioOnInteraction = async () => {
        try {
          if (audioRef.current && !isPlaying) {
            await audioRef.current.play()
            setIsPlaying(true)
            // Remover los listeners después de la primera reproducción
            document.removeEventListener('click', startAudioOnInteraction)
            document.removeEventListener('scroll', startAudioOnInteraction)
            document.removeEventListener('touchstart', startAudioOnInteraction)
          }
        } catch (error) {
          console.log('Error al reproducir audio:', error)
        }
      }
      
      // Intentar reproducir inmediatamente
      const playImmediately = async () => {
        try {
          await audioRef.current?.play()
          setIsPlaying(true)
        } catch (error) {
          // Si falla, agregar listeners para reproducir en la primera interacción
          document.addEventListener('click', startAudioOnInteraction)
          document.addEventListener('scroll', startAudioOnInteraction)
          document.addEventListener('touchstart', startAudioOnInteraction)
        }
      }
      
      playImmediately()
    }
  }, [audioInitialized, isPlaying])

  // Fecha del bautizo: 13 de diciembre 2025, 1:00 PM
  const baptismDate = new Date("2025-12-13T13:00:00")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = baptismDate.getTime() - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setNombresAdultos(new Array(adultos).fill(""))
  }, [adultos])

  useEffect(() => {
    setNombresNinos(new Array(ninos).fill(""))
  }, [ninos])

  const handleNombreAdultoChange = (index: number, value: string) => {
    const newNombres = [...nombresAdultos]
    newNombres[index] = value
    setNombresAdultos(newNombres)
  }

  const handleNombreNinoChange = (index: number, value: string) => {
    const newNombres = [...nombresNinos]
    newNombres[index] = value
    setNombresNinos(newNombres)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Preparar mensaje para WhatsApp
      const nombresAdultosTexto = nombresAdultos.filter(nombre => nombre.trim() !== "").join(", ")
      const nombresNinosTexto = nombresNinos.filter(nombre => nombre.trim() !== "").join(", ")
      
      let mensaje_whatsapp = `*CONFIRMACIÓN DE ASISTENCIA - BAUTIZO ASHLEY*\n\n`
      mensaje_whatsapp += `Cantidad de Adultos: ${adultos}\n`
      mensaje_whatsapp += `Cantidad de Niños: ${ninos}\n\n`
      
      if (nombresAdultosTexto) {
        mensaje_whatsapp += `Nombres de Adultos:\n${nombresAdultosTexto}\n\n`
      }
      
      if (nombresNinosTexto) {
        mensaje_whatsapp += `Nombres de Niños:\n${nombresNinosTexto}\n\n`
      }
      
      if (mensaje.trim()) {
        mensaje_whatsapp += `Mensaje especial para Ashley:\n"${mensaje}"\n\n`
      }
      
      mensaje_whatsapp += `Evento: 13 de Diciembre 2025\n`
      mensaje_whatsapp += `Ceremonia: 1:00 PM - Catedral de Morelia\n`
      mensaje_whatsapp += `Recepción: 5:00 PM - El Ensueño\n\n`
      mensaje_whatsapp += `¡Gracias por confirmar!`

      // Codificar el mensaje para URL
      const mensajeCodificado = encodeURIComponent(mensaje_whatsapp)
      
      // Número de WhatsApp (puedes cambiarlo al que prefieras recibir las confirmaciones)
      const numeroWhatsApp = "524432580177" // Número de Mateo
      
      // Abrir WhatsApp
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`
      
      // Simulación de delay para UX
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Abrir WhatsApp
      window.open(urlWhatsApp, "_blank")

      // Mostrar mensaje de éxito
      alert("¡Perfecto! Se abrirá WhatsApp para enviar tu confirmación 💕")

      // Resetear formulario
      setAdultos(0)
      setNinos(0)
      setNombresAdultos([])
      setNombresNinos([])
      setMensaje("")
    } catch (error) {
      alert("Hubo un error al procesar la confirmación. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Audio de fondo */}
      <audio
        ref={audioRef}
        src="/skyfullstars.mp3"
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Botón flotante de control de audio */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleAudio}
          className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg"
          size="icon"
        >
          {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 to-blue-100/20"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            {/* <Baby className="w-16 h-16 mx-auto mb-4 text-pink-400" /> */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200 bg-clip-text text-transparent drop-shadow-lg mb-2 tracking-wider leading-tight" 
                style={{ fontFamily: 'Georgia, serif' }}>MI BAUTIZO</h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 bg-clip-text text-transparent drop-shadow-md mb-8 tracking-widest leading-tight" 
                style={{ fontFamily: 'Georgia, serif' }}>ASHLEY DAYANNA</h2>
          </div>

          {/* Tres fotos con números de fecha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Foto 1 - Número 13 */}
            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image src="/images/ashley-3.jpeg" alt="Ashley sonriendo" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">13</span>
              </div>
            </div>

            {/* Foto 2 - Número 12 */}
            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image src="/images/ashley-2.jpeg" alt="Ashley en el auto" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">DIC</span>
              </div>
            </div>

            {/* Foto 3 - Número 25 */}
            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image src="/images/ashley-1.jpeg" alt="Ashley en el columpio" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">25</span>
              </div>
            </div>
          </div>

          {/* Mensaje principal */}
          <div className="bg-pink-100/60 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 shadow-lg mb-8">
            <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed text-center max-w-4xl mx-auto">
              CON INMENSA ALEGRÍA EN NUESTROS CORAZONES, QUEREMOS COMPARTIR CONTIGO UN MOMENTO MUY ESPECIAL: EL DÍA EN
              QUE <strong>ASHLEY DAYANNA PRADO MARTÍNEZ</strong> RECIBIRÁ EL SACRAMENTO DEL BAUTISMO Y COMENZARÁ SU
              CAMINO EN LA FE, RODEADO DEL AMOR DE SU FAMILIA Y DE DIOS.
            </p>
          </div>

          {/* Ícono religioso */}
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <Image 
                src="/paloma.png" 
                alt="Paloma del Espíritu Santo" 
                width={256} 
                height={256} 
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Padres */}
          <div className="text-center mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-pink-500 mb-4">CON LA BENDICIÓN DE DIOS Y MIS QUERIDOS PADRES</h3>
            <div className="space-y-2">
              <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">DAIRA VIOLETA MARTÍNEZ LEYVA</p>
              <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">LUIS EDUARDO PRADO GARCÍA</p>
            </div>
          </div>

          {/* Padrinos */}
          <div className="text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-pink-500 mb-4">Y EN COMPAÑÍA DE MIS PADRINOS</h3>
            <div className="space-y-2">
              <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">METZTLI JAZMÍN MARTÍNEZ LEYVA</p>
              <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">MATEO RODRÍGUEZ ALFONSO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-400 via-purple-300 to-pink-300 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Fecha superior */}
          <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
            <div className="text-left">
              <div className="h-0.5 bg-orange-300 w-20 mb-2"></div>
              <h3 className="text-2xl font-light text-gray-700">SÁBADO</h3>
              <div className="h-0.5 bg-orange-300 w-20 mb-2"></div>
            </div>

            <div className="text-center">
              <div className="text-8xl md:text-9xl font-bold text-teal-600 leading-none">13</div>
              <div className="text-xl font-semibold text-teal-600 -mt-2">DICIEMBRE</div>
            </div>

            <div className="text-right">
              <div className="h-0.5 bg-orange-300 w-20 mb-2 ml-auto"></div>
              <h3 className="text-2xl font-light text-gray-700">2025</h3>
              <div className="h-0.5 bg-orange-300 w-20 mb-2 ml-auto"></div>
            </div>
          </div>

          {/* Título principal */}
          <div className="mb-12">
            <h2
              className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
              style={{
                textShadow: "3px 3px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(255,255,255,0.1)",
                WebkitTextStroke: "2px rgba(255,255,255,0.8)",
              }}
            >
              ¿CUÁNTO FALTA?
            </h2>
          </div>

          {/* Contador */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/30">
            <div className="grid grid-cols-4 gap-4 md:gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">{timeLeft.days}</div>
                <div className="text-sm md:text-base font-semibold text-gray-700 uppercase tracking-wider">Días</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">{timeLeft.hours}</div>
                <div className="text-sm md:text-base font-semibold text-gray-700 uppercase tracking-wider">Horas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">{timeLeft.minutes}</div>
                <div className="text-sm md:text-base font-semibold text-gray-700 uppercase tracking-wider">Minutos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">{timeLeft.seconds}</div>
                <div className="text-sm md:text-base font-semibold text-gray-700 uppercase tracking-wider">
                  Segundos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos decorativos de fondo */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200/20 rounded-full blur-lg"></div>
      </section>

      {/* Event Details */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent>
                <div className="flex items-center mb-4">
                  <Church className="w-6 h-6 mr-2 text-pink-500" />
                  <h4 className="text-xl font-bold text-gray-800">CEREMONIA RELIGIOSA</h4>
                </div>
                <p className="text-gray-600 mb-2">
                  <strong>HORA:</strong> 1:00 PM
                </p>
                <div className="flex items-start mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-pink-500 mt-1" />
                  <div>
                    <p className="font-semibold">CATEDRAL DE MORELIA</p>
                    <p className="text-sm text-gray-600">Av Francisco I. Madero Pte S/N, Centro Histórico de Morelia</p>
                  </div>
                </div>
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src="/morelia-cathedral-exterior.png"
                    alt="Catedral de Morelia"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <Button
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  onClick={() => window.open("https://maps.app.goo.gl/a8QY9mwYuirhdyLfA", "_blank")}
                >
                  Ver ubicación en Maps
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent>
                <div className="flex items-center mb-4">
                  <Wine className="w-6 h-6 mr-2 text-blue-500" />
                  <h4 className="text-xl font-bold text-gray-800">RECEPCIÓN</h4>
                </div>
                <p className="text-gray-600 mb-2">
                  <strong>HORA:</strong> 5:00 PM
                </p>
                <div className="flex items-start mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500 mt-1" />
                  <div>
                    <p className="font-semibold">EL ENSUEÑO SALÓN DE EVENTOS</p>
                    <p className="text-sm text-gray-600">Cam. al Edén, El Eden, Tenencia Morelos</p>
                  </div>
                </div>
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src="/el-ensueno-exterior.png"
                    alt="El Ensueño Salón de Eventos"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => window.open("https://maps.app.goo.gl/vDGuyXGAWTHDq1wo6", "_blank")}
                >
                  Ver ubicación en Maps
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dress Code Card */}
          <Card className="mt-8 p-8 text-center bg-pink-50/80">
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Ilustraciones de vestimenta */}
                <div className="flex gap-4">
                  <img src="/dress-outline.png" alt="Vestido elegante" className="w-20 h-30 opacity-60" />
                  <img src="/suit-outline.png" alt="Traje elegante" className="w-20 h-30 opacity-60" />
                </div>

                <div className="text-center">
                  <h4 className="text-3xl font-bold text-pink-500 mb-4">DRESS CODE</h4>
                  <p className="text-lg text-gray-700 max-w-md">
                    NO HAY CÓDIGO DE VESTIMENTA: LO IMPORTANTE ES TU COMPAÑÍA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4 bg-pink-50/60">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white/80">
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-4xl font-bold text-pink-500 mb-4">GALERÍA</h3>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">
                    COMPARTE CONMIGO TODAS TUS FOTOGRAFÍAS DEL EVENTO
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Sube tus fotos a nuestra carpeta compartida de Google Drive para que todos podamos disfrutar de los
                    recuerdos juntos.
                  </p>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                    onClick={() =>
                      window.open(
                        "https://drive.google.com/drive/folders/1W6HoD86uH6zWyB0TwImQYXp2-885yGAc?usp=drive_link",
                        "_blank",
                      )
                    }
                  >
                    Acceder a la Galería de Drive
                  </Button>
                </div>

                {/* Carrusel de imágenes */}
                <div className="flex-shrink-0 w-full md:w-1/2 max-w-sm mx-auto">
                  <Card>
                    <CardContent className="p-6">
                      <div className="relative w-full">
                        {/* Contenedor de la imagen actual */}
                        <div className="relative aspect-square overflow-hidden rounded-lg">
                          <img
                            src={galleryImages[currentImageIndex]}
                            alt={`Foto de Ashley ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log('❌ Error cargando imagen:', galleryImages[currentImageIndex]);
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                            onLoad={() => {
                              console.log('✅ Imagen cargada:', galleryImages[currentImageIndex]);
                            }}
                          />
                        </div>

                        {/* Botones de navegación */}
                        {!isMobile && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                              onClick={goToPrevious}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                              onClick={goToNext}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {/* Indicadores de puntos */}
                        <div className="flex justify-center mt-4 space-x-2">
                          {galleryImages.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex 
                                  ? 'bg-pink-500' 
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>

                        {/* Información del carousel */}
                        <div className="text-center mt-4">
                          {/* <p className="text-sm text-gray-600">
                            Foto {currentImageIndex + 1} de {galleryImages.length}
                          </p> */}
                          {/* <p className="text-xs text-gray-500 mt-1">
                            📸 Cambio automático cada 5 segundos
                          </p> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* RSVP Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">CONFIRMA TU ASISTENCIA</h3>
          <Card className="p-8">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adultos">Cantidad de Adultos</Label>
                    <Input
                      id="adultos"
                      type="number"
                      min="0"
                      value={adultos === 0 ? "" : adultos}
                      onChange={(e) => setAdultos(Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ninos">Cantidad de Niños</Label>
                    <Input
                      id="ninos"
                      type="number"
                      min="0"
                      value={ninos === 0 ? "" : ninos}
                      onChange={(e) => setNinos(Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>

                {nombresAdultos.length > 0 && (
                  <div>
                    <Label>Nombres de los Adultos que asistirán:</Label>
                    <div className="space-y-2 mt-2">
                      {nombresAdultos.map((nombre, index) => (
                        <Input
                          key={`adulto-${index}`}
                          placeholder={`Nombre del adulto ${index + 1}`}
                          value={nombre}
                          onChange={(e) => handleNombreAdultoChange(index, e.target.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {nombresNinos.length > 0 && (
                  <div>
                    <Label>Nombres de los Niños que asistirán:</Label>
                    <div className="space-y-2 mt-2">
                      {nombresNinos.map((nombre, index) => (
                        <Input
                          key={`nino-${index}`}
                          placeholder={`Nombre del niño ${index + 1}`}
                          value={nombre}
                          onChange={(e) => handleNombreNinoChange(index, e.target.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="mensaje">Mensaje especial para Ashley (opcional)</Label>
                  <Textarea
                    id="mensaje"
                    placeholder="Escribe un mensaje especial para Ashley..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  disabled={isSubmitting || (adultos === 0 && ninos === 0)}
                >
                  {isSubmitting ? "Enviando..." : "Confirmar Asistencia"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-100 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">CONTACTO</h3>
          <p className="text-lg text-gray-700 mb-8">PARA CUALQUIER DUDA PUEDES CONTACTAR DIRECTAMENTE</p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardContent className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4 text-pink-500" />
                <h4 className="font-semibold text-lg mb-2">VIOLETA</h4>
                <p className="text-xl font-bold text-gray-800 mb-4">443 173 9924</p>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => window.open("https://wa.me/524431739924?text=*%C2%A1Hola!*%0AMe%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20evento.%20", "_blank")}
                >
                  Enviar WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4 text-blue-500" />
                <h4 className="font-semibold text-lg mb-2">METZTLI</h4>
                <p className="text-xl font-bold text-gray-800 mb-4">443 258 0177</p>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => window.open("https://wa.me/524432580177?text=*%C2%A1Hola!*%0AMe%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20evento.%20", "_blank")}
                >
                  Enviar WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-0 px-0 bg-gradient-to-r from-pink-400 via-pink-300 to-purple-300 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center min-h-[300px]">
          {/* Texto ¡TE ESPERAMOS! */}
          <div className="flex-1 px-4 sm:px-8 md:px-16 py-8 sm:py-12 text-center md:text-left">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-lg leading-tight"
              style={{
                textShadow: "3px 3px 0px rgba(0,0,0,0.2), -1px -1px 0px rgba(255,255,255,0.1)",
              }}
            >
              ¡TE ESTARÉ ESPERANDO!
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mt-4 font-light">Con amor, Ashley</p>
          </div>

          {/* Foto de la familia */}
          <div className="flex-shrink-0 w-full md:w-1/3 h-[300px] relative">
            <Image
              src="/images/ashley-family.jpeg"
              alt="Familia Prado Martínez"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-pink-400/20"></div>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-purple-200/20 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-pink-200/20 rounded-full blur-md"></div>
      </footer>
    </div>
  )
}
