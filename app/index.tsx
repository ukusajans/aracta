import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// API Adresiniz
const API_URL = 'https://aracta.com.tr/api';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Giriş mi Kayıt mı?
  const [loading, setLoading] = useState(false);

  // Form Verileri
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // İşlem Fonksiyonu
  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (!isLogin && !fullName) {
      Alert.alert('Hata', 'Lütfen adınızı girin.');
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

      if (data.success || data.durum === 'basarili' || data.id) { 
        if (isLogin) {
          // Giriş Başarılı -> Ana Sayfaya Yönlendir ve Geçmişi Sil (Replace)
          router.replace('/(tabs)'); 
        } else {
          Alert.alert('Başarılı', 'Kayıt oluşturuldu, şimdi giriş yapabilirsiniz.');
          setIsLogin(true);
        }
      } else {
        Alert.alert('Hata', data.mesaj || 'Kullanıcı adı veya şifre hatalı.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı. Lütfen internetinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Ionicons name="car-sport" size={64} color="#2563EB" />
        </View>
        <Text style={styles.title}>Araçta</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Tekrar hoş geldin!' : 'Hemen aramıza katıl!'}
        </Text>
      </View>

      <View style={styles.form}>
        
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Ad Soyad"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#999"
              autoCorrect={false}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="E-posta Adresi"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Şifre"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
            <Text style={styles.switchTextBold}>
              {isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#DBEAFE',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#2563EB',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#6B7280',
  },
  switchTextBold: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
});