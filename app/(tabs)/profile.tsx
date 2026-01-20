import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Resim seçici
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  lacivert: '#002b47',
  turuncu: '#ff5c36',
  beyaz: '#ffffff',
  arkaplan: '#f4f6f9',
  griMetin: '#666666',
  kirmizi: '#ef4444',
  yesil: '#10b981',
  border: '#e5e7eb',
  inputBg: '#f9fafb',
};

export default function ProfileScreen() {
  // --- STATE YÖNETİMİ ---
  
  // 1. Kullanıcı Bilgileri
  const [user, setUser] = useState({
    name: 'Zeynep Yılmaz',
    email: 'zeynep@aracta.com',
    phone: '+90 555 123 45 67',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isPremium: true,
    completeness: 85, // Profil doluluk oranı
  });

  // 2. Ayarlar
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    biometric: false, // FaceID / TouchID
    darkMode: false,
  });

  // 3. Modallar
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  
  // Geçici veriler
  const [tempUser, setTempUser] = useState({ ...user });

  // --- FONKSİYONLAR ---

  // FOTOĞRAF SEÇME FONKSİYONU (YENİ)
  const pickImage = async () => {
    // İzin iste
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf değiştirmek için galeri izni vermelisiniz.');
      return;
    }

    // Galeriyi Aç
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Kare kırpma
      quality: 0.8,
    });

    if (!result.canceled) {
      setUser({ ...user, avatar: result.assets[0].uri });
      setTempUser({ ...tempUser, avatar: result.assets[0].uri }); // Modal için de güncelle
      Alert.alert("Harika!", "Profil fotoğrafın başarıyla güncellendi.");
    }
  };

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    Alert.alert("Çıkış Yap", "Oturumu kapatmak istediğine emin misin?", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Çıkış Yap", style: "destructive" }
    ]);
  };

  const handleShare = async () => {
    try { 
        await Share.share({ 
            message: `Araçta uygulamasını kullanıyorum! Davet kodum: ZEYNEP2025. İndir ve kazan: https://aracta.app` 
        }); 
    } catch (error) {}
  };

  const saveProfile = () => {
    setUser(tempUser);
    setEditModalVisible(false);
    Alert.alert("Başarılı", "Profil bilgilerin güncellendi.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* --- BAŞLIK --- */}
        <View style={styles.titleSection}>
            <View>
                <Text style={styles.pageTitle}>Profilim</Text>
                <Text style={styles.pageSubtitle}>Hesap ve tercihlerini yönet</Text>
            </View>
            <TouchableOpacity style={styles.editIconBtn} onPress={() => { setTempUser(user); setEditModalVisible(true); }}>
                <MaterialCommunityIcons name="account-edit-outline" size={24} color={COLORS.lacivert} />
            </TouchableOpacity>
        </View>

        {/* --- PROFİL KARTI --- */}
        <View style={styles.profileCard}>
            <View style={styles.avatarRow}>
                <View>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
                        <Ionicons name="camera" size={14} color="#fff" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    
                    {/* Profil Doluluk Barı */}
                    <View style={styles.completenessContainer}>
                        <View style={styles.progressBg}>
                            <View style={[styles.progressFill, { width: `${user.completeness}%` }]} />
                        </View>
                        <Text style={styles.progressText}>Profil: %{user.completeness}</Text>
                    </View>
                </View>
            </View>

            {user.isPremium && (
                <View style={styles.premiumBanner}>
                    <MaterialCommunityIcons name="crown" size={16} color="#fbbf24" />
                    <Text style={styles.premiumBannerText}>Premium Üyelik Aktif</Text>
                    <Ionicons name="chevron-forward" size={16} color="#fff" style={{marginLeft:'auto'}}/>
                </View>
            )}
        </View>

        {/* --- İSTATİSTİK ŞERİDİ --- */}
        <View style={styles.statsRow}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>2</Text>
                <Text style={styles.statLabel}>Araç</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Randevu</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>₺450</Text>
                <Text style={styles.statLabel}>Puan</Text>
            </View>
        </View>

        {/* --- HESAP & CÜZDAN --- */}
        <Text style={styles.sectionHeader}>HESAP & BELGELER</Text>
        <View style={styles.menuGroup}>
            <MenuItem icon="wallet-outline" title="Cüzdanım & Kartlar" color={COLORS.lacivert} onPress={() => {}}/>
            <View style={styles.menuDivider} />
            <MenuItem icon="document-text-outline" title="Ehliyet & Ruhsatlarım" color={COLORS.lacivert} onPress={() => {}}/>
            <View style={styles.menuDivider} />
            <MenuItem icon="location-outline" title="Kayıtlı Adresler" color={COLORS.lacivert} onPress={() => {}}/>
        </View>

        {/* --- TERCİHLER --- */}
        <Text style={styles.sectionHeader}>TERCİHLER</Text>
        <View style={styles.menuGroup}>
            <MenuItem 
                icon="globe-outline" 
                title="Dil / Language" 
                color={COLORS.lacivert} 
                rightText="Türkçe"
                onPress={() => setLangModalVisible(true)}
            />
            <View style={styles.menuDivider} />
             <View style={styles.menuRow}>
                <View style={styles.menuLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: '#e0f2fe' }]}>
                        <Ionicons name="moon-outline" size={20} color={COLORS.lacivert} />
                    </View>
                    <Text style={styles.menuText}>Karanlık Mod</Text>
                </View>
                <Switch 
                    value={settings.darkMode} 
                    onValueChange={() => toggleSwitch('darkMode')}
                    trackColor={{ false: "#d1d5db", true: COLORS.lacivert }}
                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                />
            </View>
        </View>

        {/* --- GÜVENLİK --- */}
        <Text style={styles.sectionHeader}>GÜVENLİK</Text>
        <View style={styles.menuGroup}>
             <View style={styles.menuRow}>
                <View style={styles.menuLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: '#e0f2fe' }]}>
                        <Ionicons name="finger-print-outline" size={20} color={COLORS.lacivert} />
                    </View>
                    <Text style={styles.menuText}>FaceID / TouchID</Text>
                </View>
                <Switch 
                    value={settings.biometric} 
                    onValueChange={() => toggleSwitch('biometric')}
                    trackColor={{ false: "#d1d5db", true: COLORS.yesil }}
                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                />
            </View>
            <View style={styles.menuDivider} />
            <MenuItem icon="lock-closed-outline" title="Şifre Değiştir" color={COLORS.lacivert} onPress={() => {}}/>
        </View>

        {/* --- DAVET ALANI --- */}
        <TouchableOpacity style={styles.inviteCard} onPress={handleShare}>
            <LinearGradientBackground>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={styles.giftIconBox}>
                        <MaterialCommunityIcons name="gift-outline" size={24} color="#fff" />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.inviteTitle}>Arkadaşını Davet Et</Text>
                        <Text style={styles.inviteDesc}>Her davette 50 TL yakıt puan kazan!</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </View>
            </LinearGradientBackground>
        </TouchableOpacity>

        {/* --- AKSİYONLAR --- */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Oturumu Kapat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={() => {}}>
            <Text style={styles.deleteText}>Hesabımı Sil</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Araçta v2.2.0 (Build 204)</Text>
      </ScrollView>

      {/* --- MODAL: PROFİL DÜZENLE --- */}
      <Modal animationType="slide" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Profili Düzenle</Text>
                    <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeBtn}>
                        <Ionicons name="close" size={26} color="#555" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{alignItems:'center', marginBottom: 20}}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image source={{ uri: tempUser.avatar }} style={{width: 90, height: 90, borderRadius: 45}} />
                            <View style={{position:'absolute', bottom:0, right:0, backgroundColor: COLORS.turuncu, padding:6, borderRadius:15}}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <Text style={{marginTop:8, color: COLORS.turuncu, fontSize:13}}>Fotoğrafı Değiştir</Text>
                    </View>

                    <Text style={styles.inputLabel}>Ad Soyad</Text>
                    <TextInput style={styles.input} value={tempUser.name} onChangeText={t => setTempUser({...tempUser, name: t})} />

                    <Text style={styles.inputLabel}>Telefon</Text>
                    <TextInput style={styles.input} value={tempUser.phone} onChangeText={t => setTempUser({...tempUser, phone: t})} keyboardType="phone-pad"/>

                    <Text style={styles.inputLabel}>E-posta</Text>
                    <TextInput style={styles.input} value={tempUser.email} onChangeText={t => setTempUser({...tempUser, email: t})} keyboardType="email-address"/>
                </ScrollView>

                <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                    <Text style={styles.saveBtnText}>Kaydet</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* --- MODAL: DİL SEÇİMİ --- */}
      <Modal animationType="fade" transparent={true} visible={langModalVisible} onRequestClose={() => setLangModalVisible(false)}>
          <View style={styles.modalOverlayCenter}>
              <View style={styles.langContent}>
                  <Text style={styles.modalTitle}>Dil Seçimi</Text>
                  {['Türkçe', 'English', 'Deutsch', 'العربية'].map((lang, index) => (
                      <TouchableOpacity key={index} style={styles.langOption} onPress={() => setLangModalVisible(false)}>
                          <Text style={styles.langText}>{lang}</Text>
                          {index === 0 && <Ionicons name="checkmark-circle" size={20} color={COLORS.turuncu} />}
                      </TouchableOpacity>
                  ))}
                   <TouchableOpacity style={{marginTop:15, alignSelf:'center'}} onPress={() => setLangModalVisible(false)}>
                      <Text style={{color:'#666'}}>Kapat</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- YARDIMCI BİLEŞENLER ---

// Basit bir gradient arka plan simülasyonu (LinearGradient kullanmadan)
const LinearGradientBackground = ({children}: any) => (
    <View style={{backgroundColor: COLORS.lacivert, padding: 15, borderRadius: 16}}>
        {children}
    </View>
);

const MenuItem = ({ icon, title, color, rightText, onPress }: any) => (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
        <View style={styles.menuLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: color === COLORS.turuncu ? '#fff7ed' : '#e0f2fe' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text style={styles.menuText}>{title}</Text>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
            {rightText && <Text style={{color:'#999', fontSize:13, marginRight:5}}>{rightText}</Text>}
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.arkaplan },
  
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.lacivert },
  pageSubtitle: { fontSize: 13, color: COLORS.griMetin },
  editIconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },

  profileCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.lacivert, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  userInfo: { marginLeft: 15, flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.lacivert },
  userEmail: { fontSize: 13, color: COLORS.griMetin, marginTop: 2 },
  
  completenessContainer: { marginTop: 8 },
  progressBg: { height: 4, backgroundColor: '#f0f0f0', borderRadius: 2, width: '100%', marginBottom: 4 },
  progressFill: { height: 4, backgroundColor: COLORS.yesil, borderRadius: 2 },
  progressText: { fontSize: 10, color: COLORS.yesil, fontWeight: 'bold' },

  premiumBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lacivert, marginTop: 15, padding: 10, borderRadius: 12 },
  premiumBannerText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 8 },

  statsRow: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, padding: 15, justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: COLORS.lacivert },
  statLabel: { fontSize: 11, color: COLORS.griMetin },
  statDivider: { width: 1, height: 25, backgroundColor: '#f0f0f0' },

  sectionHeader: { marginLeft: 25, marginBottom: 8, fontSize: 11, fontWeight: '800', color: '#9ca3af', letterSpacing: 0.5 },
  menuGroup: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, padding: 5, marginBottom: 20 },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuText: { fontSize: 15, color: '#1f2937', fontWeight: '500' },
  menuDivider: { height: 1, backgroundColor: '#f3f4f6', marginLeft: 56 },

  inviteCard: { marginHorizontal: 20, marginBottom: 20 },
  giftIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  inviteTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  inviteDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

  logoutBtn: { backgroundColor: '#fff', marginHorizontal: 20, padding: 15, borderRadius: 16, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  logoutText: { color: COLORS.lacivert, fontWeight: 'bold' },
  deleteBtn: { alignItems: 'center', marginBottom: 20, padding: 10 },
  deleteText: { color: COLORS.kirmizi, fontSize: 13, fontWeight: '600' },
  versionText: { textAlign: 'center', color: '#cbd5e1', fontSize: 10, marginBottom: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: 450 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.lacivert },
  closeBtn: { padding: 5 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.lacivert, marginBottom: 6, marginTop: 15 },
  input: { backgroundColor: COLORS.inputBg, padding: 15, borderRadius: 12, fontSize: 15, color: '#333', borderWidth: 1, borderColor: COLORS.border },
  saveBtn: { backgroundColor: COLORS.turuncu, padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  langContent: { backgroundColor: '#fff', width: '80%', padding: 20, borderRadius: 20 },
  langOption: { flexDirection:'row', justifyContent:'space-between', paddingVertical: 15, borderBottomWidth:1, borderBottomColor:'#f0f0f0' },
  langText: { fontSize: 16, color: '#333' },
});