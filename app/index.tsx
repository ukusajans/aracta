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
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const API_URL = 'https://aracta.com.tr/api';

export default function LoginScreen() {
  const router = useRouter();

  // --- State Yönetimi ---
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Verileri
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Modallar
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // Sosyal Medya Simülasyonu
  const [socialModalVisible, setSocialModalVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  // --- Şifre Sıfırlama İşlemi ---
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      Alert.alert('Uyarı', 'Lütfen e-posta adresinizi giriniz.');
      return;
    }
    
    // Simülasyon: Burada backend'e istek atılacak
    Alert.alert('Başarılı', `${resetEmail} adresine sıfırlama bağlantısı gönderildi.`);
    setForgotModalVisible(false);
    setResetEmail('');
  };

  // --- Sosyal Medya Seçimi ---
  const openSocialPicker = (platform: string) => {
    setSelectedPlatform(platform);
    setSocialModalVisible(true);
  };

  const handleSocialSelect = (accountName: string) => {
    setSocialModalVisible(false);
    Alert.alert(
      `${selectedPlatform} Girişi`,
      `${accountName} ile giriş yapılıyor...`,
      [
        { text: "Tamam", onPress: () => router.replace('/(tabs)') }
      ]
    );
  };

  // --- Backend Giriş/Kayıt ---
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
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- Arka Plan ve Header --- */}
      <LinearGradient
        colors={['#1E3A8A', '#2563EB', '#60A5FA']}
        style={styles.headerBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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

      {/* --- Form Alanı --- */}
      <View style={styles.formSection}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Giriş/Kayıt Sekmesi */}
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

          <Text style={styles.welcomeTitle}>
            {isLogin ? 'Tekrar Hoş Geldiniz' : 'Hesap Oluşturun'}
          </Text>
          <Text style={styles.welcomeSub}>
            {isLogin ? 'Hesabınıza erişmek için bilgilerinizi girin.' : 'Avantajlar dünyasına katılmak için formu doldurun.'}
          </Text>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            
            {!isLogin && (
              <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  placeholder="Ad Soyad"
                  style={styles.input}
                  placeholderTextColor="#94A3B8"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            )}

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

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassBtn} onPress={() => setForgotModalVisible(true)}>
                <Text style={styles.forgotPassText}>Şifremi Unuttum?</Text>
              </TouchableOpacity>
            )}

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

            {/* Sosyal Medya */}
            <View style={styles.socialSection}>
              <View style={styles.dividerBox}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya şununla devam et</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialIcons}>
                <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialPicker('Google')}>
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialPicker('Apple')}>
                  <Ionicons name="logo-apple" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} onPress={() => openSocialPicker('Facebook')}>
                  <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              </View>
            </View>

          </KeyboardAvoidingView>
        </ScrollView>
      </View>

      {/* --- MODAL: Şifremi Unuttum --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={forgotModalVisible}
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setForgotModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Şifremi Unuttum</Text>
                  <TouchableOpacity onPress={() => setForgotModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.modalDesc}>
                  Hesabınıza ait e-posta adresini girin, size şifre sıfırlama bağlantısı gönderelim.
                </Text>

                <View style={[styles.inputWrapper, { marginTop: 16 }]}>
                  <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    placeholder="E-posta Adresi"
                    style={styles.input}
                    placeholderTextColor="#94A3B8"
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity style={styles.modalButton} onPress={handlePasswordReset}>
                  <Text style={styles.modalButtonText}>Bağlantı Gönder</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- MODAL: Sosyal Medya Hesap Seçici --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={socialModalVisible}
        onRequestClose={() => setSocialModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSocialModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.accountPickerCard}>
                <Text style={styles.pickerTitle}>{selectedPlatform} ile devam et</Text>
                <Text style={styles.pickerSub}>Bir hesap seçin</Text>

                {/* Örnek Hesaplar (Simülasyon) */}
                <TouchableOpacity style={styles.accountRow} onPress={() => handleSocialSelect('Ufuk Kaya')}>
                  <View style={[styles.avatarCircle, { backgroundColor: '#DB4437' }]}>
                    <Text style={styles.avatarText}>U</Text>
                  </View>
                  <View>
                    <Text style={styles.accountName}>Ufuk Kaya</Text>
                    <Text style={styles.accountEmail}>ufuk@aracta.com.tr</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accountRow} onPress={() => handleSocialSelect('Misafir Kullanıcı')}>
                  <View style={[styles.avatarCircle, { backgroundColor: '#2563EB' }]}>
                    <Text style={styles.avatarText}>M</Text>
                  </View>
                  <View>
                    <Text style={styles.accountName}>Misafir Kullanıcı</Text>
                    <Text style={styles.accountEmail}>misafir@gmail.com</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accountRow} onPress={() => setSocialModalVisible(false)}>
                  <View style={[styles.avatarCircle, { backgroundColor: '#64748B' }]}>
                    <Ionicons name="add" size={24} color="#fff" />
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={styles.accountName}>Başka bir hesap ekle</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2563EB' },
  headerBackground: { height: height * 0.35, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 },
  logoArea: { alignItems: 'center' },
  logo: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, marginBottom: 10 },
  brandName: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  brandSlogan: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 5 },
  
  formSection: {
    flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30,
    paddingHorizontal: 24, paddingTop: 30, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
  },
  scrollContent: { paddingBottom: 40 },
  
  toggleContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 24 },
  toggleButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeToggle: { backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  activeToggleText: { color: '#2563EB', fontWeight: '700' },
  
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 8, textAlign: 'center' },
  welcomeSub: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 30 },
  
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 16, paddingHorizontal: 16, height: 56, marginBottom: 16
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', color: '#334155', fontSize: 16 },
  
  forgotPassBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPassText: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
  
  mainButton: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: "#2563EB", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  mainButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  
  socialSection: { marginTop: 30 },
  dividerBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 16, color: '#94A3B8', fontSize: 14 },
  socialIcons: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialBtn: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },

  // --- Modal Stilleri ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  modalDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  modalButton: { backgroundColor: '#2563EB', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // --- Hesap Seçici Stilleri ---
  accountPickerCard: { backgroundColor: '#fff', margin: 24, borderRadius: 24, padding: 24, justifyContent: 'center', alignSelf: 'center', width: width - 48 },
  pickerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', textAlign: 'center' },
  pickerSub: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  accountRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  accountName: { fontSize: 16, fontWeight: '600', color: '#334155' },
  accountEmail: { fontSize: 12, color: '#94A3B8' }
});