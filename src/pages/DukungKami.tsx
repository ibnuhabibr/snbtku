// import React from 'react'; // Removed unused import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Coffee, Gift, Users, Star, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const DukungKami = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-6">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Dukung Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Platform SNBT-KU adalah platform pembelajaran gratis yang dibuat dengan tujuan membantu 
            siswa Indonesia mempersiapkan diri menghadapi SNBT. Dukungan Anda akan membantu kami 
            terus mengembangkan fitur-fitur terbaik untuk pendidikan yang lebih baik.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Siswa Terbantu</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
              <p className="text-gray-600">Soal Latihan</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-6">
              <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Gratis Selamanya</p>
            </CardContent>
          </Card>
        </div>

        {/* Support Options */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Cara Mendukung Kami
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* QRIS Option */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zM3 15h6v6H3v-6zm2 2v2h2v-2H5zM15 3h6v6h-6V3zm2 2v2h2V5h-2zM11 5h2v2h-2V5zM5 11h2v2H5v-2zM11 11h2v2h-2v-2zM17 11h2v2h-2v-2zM11 17h2v2h-2v-2zM17 15h2v2h-2v-2zM17 19h2v2h-2v-2z"/>
                  </svg>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Donasi via QRIS
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Scan QR Code di bawah ini untuk berdonasi melalui aplikasi e-wallet favorit Anda
                </p>
                <div className="bg-gray-100 rounded-lg p-8 mb-6">
                  <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm text-center">
                      QR Code akan ditampilkan di sini
                    </p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  <Coffee className="h-4 w-4 mr-2" />
                  Donasi via QRIS
                </Button>
              </CardContent>
            </Card>

            {/* Saweria Option */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Donasi via Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Dukung kami melalui platform donasi online seperti Saweria, Trakteer, atau Ko-fi
                </p>
                <div className="space-y-3 mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full border-orange-200 hover:bg-orange-50 text-orange-600"
                    onClick={() => window.open('#', '_blank')}
                  >
                    Saweria
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 hover:bg-blue-50 text-blue-600"
                    onClick={() => window.open('#', '_blank')}
                  >
                    Trakteer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-200 hover:bg-purple-50 text-purple-600"
                    onClick={() => window.open('#', '_blank')}
                  >
                    Ko-fi
                  </Button>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  <Heart className="h-4 w-4 mr-2" />
                  Pilih Platform
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Thank You Message */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="text-center py-8">
              <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Terima Kasih atas Dukungan Anda!
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Setiap dukungan yang Anda berikan, sekecil apapun, sangat berarti bagi kami. 
                Dukungan Anda membantu kami untuk terus mengembangkan platform ini agar dapat 
                memberikan pendidikan berkualitas secara gratis untuk semua siswa Indonesia.
              </p>
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Platform ini akan tetap gratis selamanya, dukungan Anda bersifat sukarela
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DukungKami;