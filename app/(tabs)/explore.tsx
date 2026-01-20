import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  lacivert: '#002b47',
  acikMavi: '#004e80',
  turuncu: '#ff5c36',
  beyaz: '#ffffff',
  arkaplan: '#f4f6f9',
  griMetin: '#666666',
  kirmizi: '#ff4d4d',
  inputBg: '#f0f4f8',
};

// --- TİP TANIMLAMALARI (GENİŞLETİLDİ) ---
interface Car {
  id: string;
  brand: string;
  model: string;
  plate: string;
  year?: string;
  color?: string;
  fuelType?: string;
  image: string;
  currentFuel: string;
  km: string;
  isActive: boolean;
  // Yeni Eklenen Alanlar
  insuranceDate?: string;   // Sigorta Bitiş
  inspectionDate?: string;  // Muayene Bitiş
  chassisNo?: string;       // Şasi No
}

export default function ExploreScreen() {
  // --- STATE ---
  const [cars, setCars] = useState<Car[]>([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      plate: '34 DMG 482',
      year: '2023',
      color: 'Beyaz',
      fuelType: 'Hibrit',
      image: 'https://purepng.com/public/uploads/large/purepng.com-white-audi-a5-coupe-carcarvehicletransportaudi-961524660893046t3.png', 
      currentFuel: '65',
      km: '38277',
      isActive: true,
      insuranceDate: '12.05.2026',
      inspectionDate: '01.01.2027',
      chassisNo: 'A1B2C3D4E5'
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- FORM DATASI ---
  const [formBrand, setFormBrand] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formPlate, setFormPlate] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formColor, setFormColor] = useState('');
  const [formKm, setFormKm] = useState('');
  const [formFuelType, setFormFuelType] = useState('');
  const [formFuelLevel, setFormFuelLevel] = useState('');
  // Yeni Form Alanları
  const [formInsurance, setFormInsurance] = useState('');
  const [formInspection, setFormInspection] = useState('');
  const [formChassis, setFormChassis] = useState('');

  // --- FONKSİYONLAR ---
  const openAddModal = () => {
    setIsEditing(false);
    setFormBrand(''); setFormModel(''); setFormPlate('');
    setFormYear(''); setFormColor(''); setFormKm(''); 
    setFormFuelType(''); setFormFuelLevel('');
    setFormInsurance(''); setFormInspection(''); setFormChassis('');
    setModalVisible(true);
  };

  const openEditModal = (car: Car) => {
    setIsEditing(true);
    setEditingId(car.id);
    setFormBrand(car.brand);
    setFormModel(car.model);
    setFormPlate(car.plate);
    setFormYear(car.year || '');
    setFormColor(car.color || '');
    setFormKm(car.km);
    setFormFuelType(car.fuelType || '');
    setFormFuelLevel(car.currentFuel || '');
    setFormInsurance(car.insuranceDate || '');
    setFormInspection(car.inspectionDate || '');
    setFormChassis(car.chassisNo || '');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formBrand || !formModel || !formPlate) {
      Alert.alert('Eksik Bilgi', 'Lütfen Marka, Model ve Plaka alanlarını doldurunuz.');
      return;
    }

    const carData = {
      brand: formBrand,
      model: formModel,
      plate: formPlate.toUpperCase(),
      year: formYear,
      color: formColor,
      km: formKm || '0',
      fuelType: formFuelType,
      currentFuel: formFuelLevel || '50',
      insuranceDate: formInsurance,
      inspectionDate: formInspection,
      chassisNo: formChassis,
      image: formBrand.toLowerCase().includes('fiat') 
        ? 'https://purepng.com/public/uploads/large/purepng.com-fiat-egea-white-carcarvehicletransportfiat-961524664402yavpa.png'
        : 'https://purepng.com/public/uploads/large/purepng.com-white-audi-a5-coupe-carcarvehicletransportaudi-961524660893046t3.png',
    };

    if (isEditing && editingId) {
      setCars(prev => prev.map(car => car.id === editingId ? { ...car, ...carData } : car));
    } else {
      const newCar: Car = {
        id: Date.now().toString(),
        isActive: cars.length === 0,
        ...carData
      };
      setCars(prev => [...prev, newCar]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Aracı Sil", "Emin misin?", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: () => setCars(prev => prev.filter(c => c.id !== id)) }
    ]);
  };

  const handleMakeActive = (id: string) => {
    setCars(prev => prev.map(car => ({ ...car, isActive: car.id === id })));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
            <Text style={styles.headerTitle}>Garajım</Text>
            <Text style={styles.headerSubTitle}>{cars.length} Araç Yönetiliyor</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Ionicons name="add" size={30} color={COLORS.beyaz} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
        
        {cars.length === 0 && (
            <View style={styles.emptyState}>
                <View style={styles.emptyIconBg}>
                  <MaterialCommunityIcons name="car-convertible" size={50} color={COLORS.lacivert} />
                </View>
                <Text style={styles.emptyText}>Garajın şu an boş.</Text>
            </View>
        )}

        {cars.map((car) => {
          const isActive = car.isActive;
          return (
            <TouchableOpacity 
              key={car.id} 
              activeOpacity={0.95} 
              onPress={() => handleMakeActive(car.id)}
              style={[styles.cardContainer, !isActive && styles.inactiveCardScale]}
            >
              {isActive ? (
                 <LinearGradient
                    colors={[COLORS.lacivert, COLORS.acikMavi]}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    style={styles.cardBackground}
                 >
                    {renderCardContent(car, true, openEditModal, handleDelete)}
                 </LinearGradient>
              ) : (
                 <View style={[styles.cardBackground, styles.inactiveBackground]}>
                    {renderCardContent(car, false, openEditModal, handleDelete)}
                 </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* --- MODAL (Genişletilmiş Form) --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{isEditing ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color="#555" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                    
                    {/* BÖLÜM 1: TEMEL BİLGİLER */}
                    <Text style={styles.sectionHeader}>KİMLİK BİLGİLERİ</Text>
                    <View style={styles.row}>
                        <View style={{flex:1, marginRight: 10}}>
                            <Text style={styles.inputLabel}>Marka *</Text>
                            <TextInput style={styles.input} placeholder="Örn: BMW" value={formBrand} onChangeText={setFormBrand} />
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.inputLabel}>Model *</Text>
                            <TextInput style={styles.input} placeholder="Örn: 5.20i" value={formModel} onChangeText={setFormModel} />
                        </View>
                    </View>
                    <Text style={styles.inputLabel}>Plaka *</Text>
                    <TextInput style={styles.input} placeholder="34 ABC 123" value={formPlate} onChangeText={setFormPlate} autoCapitalize="characters" />

                    <View style={styles.separator} />

                    {/* BÖLÜM 2: TEKNİK BİLGİLER */}
                    <Text style={styles.sectionHeader}>TEKNİK DETAYLAR</Text>
                    <View style={styles.row}>
                         <View style={{flex:1, marginRight: 10}}>
                            <Text style={styles.inputLabel}>Yıl</Text>
                            <TextInput style={styles.input} placeholder="2024" keyboardType="numeric" value={formYear} onChangeText={setFormYear} />
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.inputLabel}>Renk</Text>
                            <TextInput style={styles.input} placeholder="Siyah" value={formColor} onChangeText={setFormColor} />
                        </View>
                    </View>
                    <View style={styles.row}>
                         <View style={{flex:1, marginRight: 10}}>
                            <Text style={styles.inputLabel}>KM</Text>
                            <TextInput style={styles.input} placeholder="10000" keyboardType="numeric" value={formKm} onChangeText={setFormKm} />
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.inputLabel}>Yakıt (%)</Text>
                            <TextInput style={styles.input} placeholder="50" keyboardType="numeric" value={formFuelLevel} onChangeText={setFormFuelLevel} maxLength={3} />
                        </View>
                    </View>

                    <View style={styles.separator} />

                    {/* BÖLÜM 3: YASAL & EK BİLGİLER (YENİ) */}
                    <Text style={styles.sectionHeader}>YASAL & YEDEK PARÇA</Text>
                    <View style={styles.row}>
                        <View style={{flex:1, marginRight: 10}}>
                            <Text style={styles.inputLabel}>Sigorta Bitiş</Text>
                            <TextInput style={styles.input} placeholder="GG.AA.YYYY" value={formInsurance} onChangeText={setFormInsurance} />
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.inputLabel}>Muayene Bitiş</Text>
                            <TextInput style={styles.input} placeholder="GG.AA.YYYY" value={formInspection} onChangeText={setFormInspection} />
                        </View>
                    </View>
                    <Text style={styles.inputLabel}>Şasi Numarası (VIN)</Text>
                    <TextInput style={styles.input} placeholder="Şasi no giriniz..." value={formChassis} onChangeText={setFormChassis} autoCapitalize="characters" />

                </ScrollView>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>{isEditing ? 'Güncelle' : 'Kaydet'}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// --- KOMPAKT KART GÖRÜNÜMÜ ---
function renderCardContent(car: Car, isActive: boolean, onEdit: any, onDelete: any) {
  const textColor = isActive ? COLORS.beyaz : COLORS.lacivert;
  const subTextColor = isActive ? 'rgba(255,255,255,0.7)' : COLORS.griMetin;
  const statBg = isActive ? 'rgba(255,255,255,0.15)' : '#f8f9fa';
  
  return (
    <View style={styles.cardInner}>
       {/* HEADER: Marka/Plaka Sol - Butonlar Sağ */}
       <View style={styles.cardHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.brandText, { color: textColor }]} numberOfLines={1}>{car.brand} {car.model}</Text>
            
            {/* Plaka ve Yıl Yan Yana */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <View style={styles.realPlate}>
                    <View style={styles.plateBluePart}><Text style={styles.plateTr}>TR</Text></View>
                    <Text style={styles.plateText}>{car.plate}</Text>
                </View>
                {car.year && <Text style={[styles.yearBadge, { color: subTextColor }]}>• {car.year}</Text>}
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => onEdit(car)} style={[styles.roundBtn, isActive ? {backgroundColor: 'rgba(255,255,255,0.2)'} : {backgroundColor: '#e3f2fd'}]}>
                 <MaterialCommunityIcons name="pencil" size={16} color={isActive ? '#fff' : COLORS.lacivert} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(car.id)} style={[styles.roundBtn, isActive ? {backgroundColor: 'rgba(255,40,40,0.2)'} : {backgroundColor: '#ffebee'}]}>
                 <MaterialCommunityIcons name="trash-can-outline" size={16} color={isActive ? '#ff8080' : COLORS.kirmizi} />
            </TouchableOpacity>
          </View>
       </View>

       {/* ORTA KISIM: Görsel ve İstatistikler Yan Yana (Yer Kazanmak İçin) */}
       <View style={styles.middleSection}>
           {/* Görsel Küçültüldü */}
           <Image 
              source={{ uri: car.image }} 
              style={styles.carImageCompact} 
              resizeMode="contain" 
           />
       </View>

       {/* İSTATİSTİKLER: Yatay ve Sıkışık */}
       <View style={styles.statsContainer}>
          <View style={[styles.statBoxCompact, { backgroundColor: statBg }]}>
             <MaterialCommunityIcons name="gas-station" size={16} color={isActive ? COLORS.turuncu : '#aaa'} />
             <Text style={[styles.statValueCompact, { color: textColor }]}>%{car.currentFuel}</Text>
          </View>
          
          <View style={[styles.statBoxCompact, { backgroundColor: statBg }]}>
             <MaterialCommunityIcons name="speedometer" size={16} color={isActive ? COLORS.turuncu : '#aaa'} />
             <Text style={[styles.statValueCompact, { color: textColor }]}>{parseInt(car.km).toLocaleString()} km</Text>
          </View>

          <View style={[styles.statBoxCompact, { backgroundColor: statBg }]}>
             <MaterialCommunityIcons name="shield-check" size={16} color={isActive ? COLORS.turuncu : '#aaa'} />
             <Text style={[styles.statValueCompact, { color: textColor }]}>
                {car.insuranceDate ? 'Sigortalı' : 'Sigorta Yok'}
             </Text>
          </View>
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.arkaplan, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.lacivert },
  headerSubTitle: { fontSize: 13, color: COLORS.griMetin },
  addBtn: { backgroundColor: COLORS.lacivert, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eef2f6', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: COLORS.lacivert },

  // --- KOMPAKT KART TASARIMI ---
  cardContainer: { marginHorizontal: 20, marginBottom: 15, borderRadius: 24, shadowColor: '#002b47', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  inactiveCardScale: { transform: [{ scale: 0.99 }], opacity: 0.9 },
  cardBackground: { borderRadius: 24, padding: 15, overflow: 'hidden' }, // Padding düşürüldü (20->15)
  inactiveBackground: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#fff' },
  cardInner: { position: 'relative' },
  
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  brandText: { fontSize: 18, fontWeight: '800' },
  yearBadge: { fontSize: 12, marginLeft: 8, fontWeight: '600' },
  
  // Plaka (Daha Küçük)
  realPlate: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 4, borderWidth: 1, borderColor: '#ccc', alignSelf: 'flex-start', overflow: 'hidden', height: 22 },
  plateBluePart: { backgroundColor: '#003399', width: 18, height: '100%', justifyContent: 'center', alignItems: 'center' },
  plateTr: { color: '#fff', fontSize: 6, fontWeight: 'bold' },
  plateText: { color: '#000', fontSize: 12, fontWeight: 'bold', paddingHorizontal: 6, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },

  actionRow: { flexDirection: 'row', gap: 8 },
  roundBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  // Orta Kısım
  middleSection: { alignItems: 'center', marginVertical: 5 },
  carImageCompact: { width: '100%', height: 100 }, // Yükseklik 160 -> 100'e düştü

  // İstatistikler (Yatay & Kompakt)
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 5 },
  statBoxCompact: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 5, borderRadius: 12, gap: 6 },
  statValueCompact: { fontSize: 12, fontWeight: 'bold' },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.lacivert },
  closeBtn: { backgroundColor: '#f0f2f5', padding: 6, borderRadius: 20 },
  
  sectionHeader: { fontSize: 11, fontWeight: '800', color: '#999', marginBottom: 10, letterSpacing: 0.5, marginTop: 5 },
  row: { flexDirection: 'row' },
  inputLabel: { fontSize: 12, fontWeight: '600', color: COLORS.lacivert, marginBottom: 5, marginLeft: 2 },
  input: { backgroundColor: COLORS.inputBg, padding: 12, borderRadius: 12, marginBottom: 12, fontSize: 14, color: '#333', borderWidth: 1, borderColor: 'transparent' },
  separator: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  saveBtn: { backgroundColor: COLORS.turuncu, padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});