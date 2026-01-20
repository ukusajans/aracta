import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Ekran genişliğini alalım
const { width } = Dimensions.get('window');

// API Adresiniz
const API_URL = 'https://aracta.com.tr/api';

export default function LoginScreen() {
  const router = useRouter();
  
  // State Yönetimi
  const [isLogin, setIsLogin] = useState(true); // Giriş / Kayıt modu
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Şifre göster/gizle

  // Form Verileri
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // --- Backend İşlemleri (Giriş/Kayıt) ---
  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    if (!isLogin && !fullName) {
      Alert.alert('Eksik Bilgi', 'Kayıt olmak için lütfen adınızı giriniz.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/login.php' : '/register.php';
      const payload = isLogin
        ? { email, password }
        : { full_name: fullName, email, password };

      // API İsteği
      const response = await axios.post(`${API_URL}${endpoint}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data;

      // Başarılı yanıt kontrolü
      if (data.success || data.durum === 'basarili' || data.id) { 
        if (isLogin) {
          // Giriş Başarılı -> Ana Sayfaya Yönlendir
          router.replace('/(tabs)'); 
        } else {
          Alert.alert('Kayıt Başarılı', 'Hesabınız oluşturuldu, şimdi giriş yapabilirsiniz.');
          setIsLogin(true); // Giriş ekranına dön
        }
      } else {
        Alert.alert('Hata', data.mesaj || 'Giriş yapılamadı, bilgileri kontrol edin.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı. İnternetinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  // --- Sosyal Medya ve Diğer İşlemler (Placeholder) ---
  const handleSocialLogin = (platform: string) => {
    Alert.alert(platform, `${platform} ile giriş özelliği çok yakında eklenecek!`);
  };

  const handleForgotPassword = () => {
    Alert.alert('Şifremi Unuttum', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderilecek (Backend entegrasyonu gerekir).');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- Header & Logo Alanı --- */}
        <View style={styles.headerContainer}>
          <View style={styles.logoShadow}>
            <Image 
              source={require('@/assets/images/logo.webp')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcomeText}>
            {isLogin ? 'Tekrar Hoş Geldiniz' : 'Hesap Oluştur'}
          </Text>
          <Text style={styles.subText}>
            {isLogin ? 'Devam etmek için giriş yapın' : 'Aramıza katılmak için formu doldurun'}
          </Text>
        </View>

        {/* --- Form Alanı --- */}
        <View style={styles.formContainer}>
          
          {/* Ad Soyad (Sadece Kayıt Modunda) */}
          {!isLogin && (
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                placeholder="Ad Soyad"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#94A3B8"
              />
            </View>
          )}

          {/* E-posta */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              placeholder="E-posta Adresi"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Şifre */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              placeholder="Şifre"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={22} 
                color="#64748B" 
              />
            </TouchableOpacity>
          </View>

          {/* Şifremi Unuttum (Sadece Giriş Modunda) */}
          {isLogin && (
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
            </TouchableOpacity>
          )}

          {/* Ana Buton (Giriş / Kayıt) */}
          <TouchableOpacity 
            style={styles.mainButton} 
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.mainButtonText}>
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* --- Bölücü (Divider) --- */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya şununla devam et</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* --- Sosyal Medya Butonları --- */}
        <View style={styles.socialContainer}>
          <TouchableOpacity 
            style={styles.socialButton} 
            onPress={() => handleSocialLogin('Google')}
          >
            <Ionicons name="logo-google" size={24} color="#DB4437" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialButton} 
            onPress={() => handleSocialLogin('Apple')}
          >
            <Ionicons name="logo-apple" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton} 
            onPress={() => handleSocialLogin('Facebook')}
          >
            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
        </View>

        {/* --- Alt Yönlendirme (Footer) --- */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {isLogin ? "Hesabınız yok mu?" : "Zaten üye misiniz?"}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.footerActionText}>
              {isLogin ? " Şimdi Kayıt Olun" : " Giriş Yapın"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Temiz, kurumsal beyaz/gri
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  
  // Header Stilleri
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoShadow: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10, // Android gölge
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },

  // Form Stilleri
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    // Hafif gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    height: '100%',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#2563EB', // Marka Mavisi
    fontWeight: '600',
    fontSize: 14,
  },
  mainButton: {
    backgroundColor: '#2563EB', // Marka Mavisi (Logo ile uyumlu)
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },

  // Sosyal Medya
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20, // Butonlar arası boşluk
    marginBottom: 40,
  },
  socialButton: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },

  // Footer
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 15,
  },
  footerActionText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 15,
  },
});