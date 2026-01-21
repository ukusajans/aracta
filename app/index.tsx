import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
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

// Ekran boyutlarını alalım
const { width, height } = Dimensions.get('window');

// API Adresi
const API_URL = 'https://aracta.com.tr/api';

export default function LoginScreen() {
  const router = useRouter();
  
  // State Yönetimi
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Verileri
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // --- Auth İşlemleri ---
  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurunuz.');
      return;
    }
    if (!isLogin && !fullName) {
      Alert.alert('Eksik Bilgi', 'Lütfen adınızı giriniz.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/login.php' : '/register.php';
      const payload = isLogin
        ? { email, password }
        : { full_name: fullName, email, password };

      const response = await axios.post(`${API_URL}${endpoint}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data;

      if (data.success || data.durum === 'basarili' || data.id) {
        if (isLogin) {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Tebrikler!', 'Aramıza hoş geldin. Şimdi giriş yapabilirsin.');
          setIsLogin(true);
        }
      } else {
        Alert.alert('Hata', data.mesaj || 'İşlem başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- Üst Arka Plan (Gradient & Logo) --- */}
      <LinearGradient
        colors={['#1E3A8A', '#2563EB', '#60A5FA']} // Koyu Maviden Açığa
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      >
        <View style={styles.logoArea}>
          <Image 
            source={require('@/assets/images/logo.webp')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Araçta</Text>
          <Text style={styles.brandSlogan}>Aracınızın Dijital Asistanı</Text>
        </View>
      </LinearGradient>

      {/* --- Alt Beyaz Alan (Form) --- */}
      <View style={styles.formSection}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Giriş / Kayıt Seçici (Segmented Control) */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, isLogin && styles.activeToggle]} 
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>Giriş Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !isLogin && styles.activeToggle]} 
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

          {/* Başlık */}
          <Text style={styles.welcomeTitle}>
            {isLogin ? 'Tekrar Hoş Geldiniz' : 'Hesap Oluşturun'}
          </Text>
          <Text style={styles.welcomeSub}>
            {isLogin ? 'Devam etmek için bilgilerinizi girin.' : 'Avantajlardan yararlanmak için formu doldurun.'}
          </Text>

          {/* Form Alanları */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            
            {/* Ad Soyad (Sadece Kayıt) */}
            {!isLogin && (
              <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  placeholder="Ad Soyad"
                  style={styles.input}
                  placeholderTextColor="#94A3B8"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            )}

            {/* E-posta */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                placeholder="E-posta Adresi"
                style={styles.input}
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Şifre */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                placeholder="Şifre"
                style={styles.input}
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Şifremi Unuttum */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotPassBtn}>
                <Text style={styles.forgotPassText}>Şifremi Unuttum?</Text>
              </TouchableOpacity>
            )}

            {/* Buton */}
            <TouchableOpacity onPress={handleAuth} disabled={loading} activeOpacity={0.8}>
              <LinearGradient
                colors={['#2563EB', '#1D4ED8']}
                style={styles.mainButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.mainButtonText}>
                    {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sosyal Medya Girişi */}
            <View style={styles.socialSection}>
              <View style={styles.dividerBox}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialIcons}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Ionicons name="logo-apple" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              </View>
            </View>

          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB', // Status bar arkası için
  },
  // Üst Gradient Alan
  headerBackground: {
    height: height * 0.35, // Ekranın %35'i
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  logoArea: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  brandSlogan: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5,
  },

  // Alt Form Alanı (Kavisli Beyaz Kutu)
  formSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, // Üst alanın içine girsin diye
    paddingHorizontal: 24,
    paddingTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Toggle (Giriş/Kayıt Seçici)
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeToggle: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeToggleText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  // Metinler
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
  },

  // Inputlar
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#334155',
    fontSize: 16,
  },

  // Şifremi Unuttum
  forgotPassBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPassText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },

  // Ana Buton
  mainButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // Sosyal Medya
  socialSection: {
    marginTop: 30,
  },
  dividerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
});