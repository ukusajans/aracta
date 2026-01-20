import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// --- TİP TANIMLAMALARI ---
interface ServiceDetail {
  label: string;
  value: string;
  isBold?: boolean;
}

interface ServiceItem {
  id: number;
  title: string;
  icon: any; 
  type: 'ion' | 'material';
  desc: string;
  isSpecial?: boolean;
  details?: ServiceDetail[]; 
}

interface BrandItem {
  id: number;
  name: string;
  icon: string;
}

interface CampaignItem {
  id: number;
  title: string;
  sub: string;
  color: [string, string, ...string[]];
}

interface TransactionItem {
  id: number;
  title: string;
  date: string;
  amount: string;
  icon: any;
  isNegative: boolean;
}

// --- TEMALAR ---
const THEME = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#002b47',
  subText: '#666666',
  accent: '#ff5c36',
  primary: '#002b47',
  secondary: '#1286d2',
  border: '#f0f0f0',
  iconBg: '#f0f4f8',
  success: '#27ae60',
  danger: '#ef4444',
};

// --- DATA ---
const SERVICES: ServiceItem[] = [
  { 
    id: 1, title: 'HGS', icon: 'card-outline', type: 'ion', desc: 'HGS bakiye ve geçiş detayları.',
    details: [
      { label: 'Etiket No', value: '1234567890' },
      { label: 'Mevcut Bakiye', value: '₺450,00', isBold: true },
      { label: 'Son Geçiş', value: '15 Temmuz Köprüsü - Dün' },
    ]
  },
  { 
    id: 2, title: 'MTV', icon: 'file-document-outline', type: 'material', desc: 'Motorlu Taşıtlar Vergisi durumu.',
    details: [
      { label: 'Dönem', value: '2025 / 1. Taksit' },
      { label: 'Son Ödeme', value: '31.01.2025' },
      { label: 'Tutar', value: '₺2.450,00', isBold: true },
    ]
  },
  { 
    id: 3, title: 'Ceza', icon: 'alert-octagon-outline', type: 'material', desc: 'Aktif trafik cezalarınız.',
    details: [
      { label: 'Plaka', value: '34 ARC 01' },
      { label: 'Ceza Durumu', value: 'Bulunamadı', isBold: true },
      { label: 'Son Kontrol', value: 'Bugün 09:41' },
    ] 
  },
  { id: 4, title: 'Sigorta', icon: 'shield-check-outline', type: 'material', desc: 'Sigorta poliçe teklifleri.', details: [{ label: 'Bitiş Tarihi', value: '12.05.2025' }, { label: 'En İyi Teklif', value: '₺4.200', isBold: true }] },
  { id: 5, title: 'Ekspertiz', icon: 'car-sport-outline', type: 'ion', desc: 'Ekspertiz raporu oluştur.', details: [{ label: 'En Yakın', value: 'Maslak Oto Sanayi' }, { label: 'Randevu', value: 'Müsait' }] },
  { id: 6, title: 'Bakım', icon: 'tools', type: 'material', desc: 'Bakım zamanı takibi.', details: [{ label: 'Son Bakım', value: '15.000 km' }, { label: 'Kalan', value: '3.400 km', isBold: true }] },
  { id: 7, title: 'Yıkama', icon: 'water-outline', type: 'ion', desc: 'Size özel yıkama paketleri.', details: [{ label: 'Paket', value: 'Gold Yıkama' }, { label: 'Fiyat', value: '₺250', isBold: true }] },
  { id: 8, title: 'Otopark', icon: 'garage-variant', type: 'material', desc: 'Vale ve otopark ödemesi.', details: [{ label: 'Konum', value: 'AVM Otoparkı' }, { label: 'Süre', value: '2 Saat' }] },
  { 
    id: 9, title: 'AI Asistan', icon: 'robot-happy-outline', type: 'material', isSpecial: true, desc: 'Aracınızla ilgili her şeyi sorun.',
    details: [
      { label: 'Analiz', value: 'Motor Performansı %98' },
      { label: 'Tahmin', value: 'Lastik değişimi yaklaşıyor.' },
    ]
  },
];

const CAMPAIGNS: CampaignItem[] = [
  { id: 1, title: 'Kış Lastiği', sub: '%20 İndirim Fırsatı', color: ['#2980b9', '#6dd5fa'] },
  { id: 2, title: 'Bakım Paketi', sub: 'Ücretsiz Check-up', color: ['#d35400', '#f1c40f'] },
  { id: 3, title: 'Kasko Fırsatı', sub: 'İlk Ay Bizden', color: ['#8e44ad', '#c39bd3'] },
];

// DÜZELTME: gas-pump -> gas-station (MaterialCommunityIcons için)
const TRANSACTIONS: TransactionItem[] = [
  { id: 1, title: 'Shell - Yakıt Alımı', date: 'Bugün, 14:30', amount: '-₺1.450,00', icon: 'gas-station', isNegative: true },
  { id: 2, title: 'HGS Yükleme', date: 'Dün, 09:15', amount: '-₺500,00', icon: 'credit-card-outline', isNegative: true },
  { id: 3, title: 'Kasko İadesi', date: '2 Gün Önce', amount: '+₺350,00', icon: 'cash', isNegative: false },
];

const MY_CARS = [
  { id: 1, name: 'Audi A5', plate: '34 ARC 01', selected: true },
  { id: 2, name: 'Fiat Egea', plate: '35 EGE 35', selected: false },
];

const BRANDS: BrandItem[] = [
  { id: 1, name: 'Axa', icon: 'shield-alt' },
  { id: 2, name: 'Allianz', icon: 'umbrella' },
  { id: 3, name: 'Shell', icon: 'gas-pump' },
  { id: 4, name: 'Opet', icon: 'oil-can' },
  { id: 5, name: 'Mapfre', icon: 'car-crash' },
];

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleServicePress = (item: ServiceItem) => {
    setSelectedService(item);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: THEME.background }]}>
      
      {/* ScrollView */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 130, paddingTop: 20 }}
      >
        
        {/* HOŞ GELDİN KISMI */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeLabel, { color: THEME.subText }]}>Hoş geldin,</Text>
          <Text style={[styles.welcomeName, { color: THEME.text }]}>Ufuk 👋</Text>
        </View>

        {/* HIZLI AKSİYONLAR / STORIES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
          <TouchableOpacity style={styles.storyItem}>
            <View style={[styles.storyCircle, { borderColor: THEME.accent, borderWidth: 2, borderStyle: 'dashed' }]}>
              <Ionicons name="add" size={24} color={THEME.text} />
            </View>
            <Text style={[styles.storyText, { color: THEME.text }]}>Ekle</Text>
          </TouchableOpacity>
          {['Randevum', 'Cezalarım', 'Belgelerim', 'Yakıt'].map((story, index) => (
            <TouchableOpacity key={index} style={styles.storyItem}>
              <LinearGradient
                 colors={['#002b47', '#1286d2']}
                 style={styles.storyCircle}
              >
                <MaterialCommunityIcons name="car-cog" size={20} color="#fff" />
              </LinearGradient>
              <Text style={[styles.storyText, { color: THEME.text }]}>{story}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* GARAJIM */}
        <View style={styles.garageSection}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {MY_CARS.map(car => (
                <TouchableOpacity 
                  key={car.id} 
                  style={[
                    styles.carChip, 
                    { backgroundColor: car.selected ? THEME.primary : THEME.card, borderColor: THEME.border }
                  ]}
                >
                  <Ionicons name="car-sport" size={16} color={car.selected ? '#fff' : THEME.subText} />
                  <Text style={[styles.carChipText, { color: car.selected ? '#fff' : THEME.subText }]}>{car.name}</Text>
                  {car.selected && <View style={styles.activeDot} />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={[styles.carChip, { backgroundColor: THEME.card, borderColor: THEME.border, borderStyle: 'dashed' }]}>
                 <Ionicons name="add" size={16} color={THEME.subText} />
                 <Text style={[styles.carChipText, { color: THEME.subText }]}>Araç Ekle</Text>
              </TouchableOpacity>
           </ScrollView>
        </View>

        {/* HERO CARD */}
        <View style={styles.sectionContainer}>
          <LinearGradient
            colors={['#002b47', '#115c96']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.aiBadge}>
                <MaterialCommunityIcons name="star-four-points" size={12} color="#ff5c36" />
                <Text style={styles.aiBadgeText}>AI Analiz Raporu</Text>
              </View>
              <Text style={styles.heroTitle}>Aracın bugün formda!</Text>
              <Text style={styles.heroSubtitle}>Lastik basınçların ideal. Yakıt tüketimin %5 daha verimli.</Text>
              <TouchableOpacity onPress={() => handleServicePress(SERVICES[8])} style={styles.heroButton}>
                <Text style={styles.heroBtnText}>Raporu İncele</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Image 
              source={{ uri: 'https://purepng.com/public/uploads/large/purepng.com-white-audi-a5-coupe-carcarvehicletransportaudi-961524660893046t3.png' }} 
              style={styles.heroCarImage}
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        {/* HİZMETLER GRID */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
             <Text style={[styles.sectionTitle, { color: THEME.text }]}>Hizmetler</Text>
             <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: THEME.accent }]}>Tümü</Text>
             </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {SERVICES.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.serviceCard, { backgroundColor: THEME.card, borderColor: THEME.border }, item.isSpecial && styles.specialCard]}
                onPress={() => handleServicePress(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: THEME.iconBg }, item.isSpecial && styles.specialIconCircle]}>
                  {item.type === 'ion' ? (
                    <Ionicons name={item.icon} size={24} color={item.isSpecial ? '#fff' : THEME.primary} />
                  ) : (
                    <MaterialCommunityIcons name={item.icon} size={24} color={item.isSpecial ? '#fff' : THEME.primary} />
                  )}
                </View>
                <Text style={[styles.serviceTitle, { color: THEME.text }, item.isSpecial && styles.specialText]} numberOfLines={1}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* KAMPANYALAR */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: THEME.text, marginBottom: 15 }]}>Süper Fırsatlar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CAMPAIGNS.map((camp) => (
              <TouchableOpacity key={camp.id} activeOpacity={0.8}>
                <LinearGradient colors={camp.color} style={styles.campaignCard}>
                  <Text style={styles.campTitle}>{camp.title}</Text>
                  <Text style={styles.campSub}>{camp.sub}</Text>
                  <View style={styles.campBtn}>
                    <Text style={styles.campBtnText}>Fırsatı Yakala</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SON HAREKETLER */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: THEME.text, marginBottom: 15 }]}>Son Hareketler</Text>
          <View style={[styles.transactionContainer, { backgroundColor: THEME.card, borderColor: THEME.border }]}>
            {TRANSACTIONS.map((tx, index) => (
              <View key={tx.id} style={[
                  styles.txItem, 
                  index !== TRANSACTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: THEME.border }
                ]}>
                <View style={[styles.txIconBox, { backgroundColor: THEME.iconBg }]}>
                  <MaterialCommunityIcons name={tx.icon} size={20} color={THEME.subText} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txTitle, { color: THEME.text }]}>{tx.title}</Text>
                  <Text style={[styles.txDate, { color: THEME.subText }]}>{tx.date}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.isNegative ? THEME.text : THEME.success }]}>
                  {tx.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* REFERANSLAR */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: THEME.text, marginBottom: 10, fontSize: 16 }]}>Anlaşmalı Kurumlar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
            {BRANDS.map((brand) => (
              <View key={brand.id} style={[styles.brandBox, { backgroundColor: THEME.card, borderColor: THEME.border }]}>
                <FontAwesome5 name={brand.icon} size={20} color={THEME.subText} />
                <Text style={[styles.brandName, { color: THEME.subText }]}>{brand.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      {/* DETAYLI MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: THEME.card }]}>
            <View style={styles.modalHandleContainer}>
              <View style={[styles.modalHandle, { backgroundColor: THEME.border }]} />
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Ionicons name="close-circle" size={30} color={THEME.subText} />
            </TouchableOpacity>

            {selectedService && (
              <View style={styles.modalBody}>
                {/* Header Kısmı */}
                <View style={styles.modalHeaderRow}>
                   <View style={[styles.modalIconBox, selectedService.isSpecial ? { backgroundColor: THEME.accent } : { backgroundColor: THEME.iconBg }]}>
                      {selectedService.type === 'ion' ? (
                          <Ionicons name={selectedService.icon} size={32} color={selectedService.isSpecial ? '#fff' : THEME.primary} />
                        ) : (
                          <MaterialCommunityIcons name={selectedService.icon} size={32} color={selectedService.isSpecial ? '#fff' : THEME.primary} />
                        )}
                   </View>
                   <View style={{ flex: 1 }}>
                      <Text style={[styles.modalTitle, { color: THEME.text }]}>{selectedService.title}</Text>
                      <Text style={[styles.modalDesc, { color: THEME.subText }]}>{selectedService.desc}</Text>
                   </View>
                </View>

                {/* Dinamik Detay Listesi */}
                <View style={[styles.detailBox, { backgroundColor: '#fcfcfc' }]}>
                   {selectedService.details?.map((detail, idx) => (
                     <View key={idx} style={[styles.detailRow, idx !== (selectedService.details?.length || 0) -1 && { borderBottomWidth: 1, borderBottomColor: THEME.border }]}>
                        <Text style={[styles.detailLabel, { color: THEME.subText }]}>{detail.label}</Text>
                        <Text style={[styles.detailValue, { color: THEME.text, fontWeight: detail.isBold ? 'bold' : '400' }]}>{detail.value}</Text>
                     </View>
                   ))}
                </View>

                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: THEME.primary }]}>
                  <Text style={styles.actionBtnText}>İşlemlere Git</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  welcomeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  storiesContainer: {
    paddingLeft: 20,
    marginBottom: 15,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  storyCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  storyText: {
    fontSize: 11,
    fontWeight: '500',
  },
  garageSection: {
    marginBottom: 20,
  },
  carChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  carChipText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginLeft: 8,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    height: 180,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  heroContent: {
    zIndex: 2,
    width: '65%',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  aiBadgeText: {
    color: '#ff5c36',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  heroSubtitle: {
    color: '#e0e0e0',
    fontSize: 12,
    marginBottom: 15,
    lineHeight: 18,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff5c36',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
  heroCarImage: {
    position: 'absolute',
    right: -25,
    bottom: -15,
    width: 190,
    height: 120,
    zIndex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  campaignCard: {
    width: 280,
    height: 140,
    borderRadius: 20,
    padding: 20,
    marginRight: 15,
    justifyContent: 'center',
  },
  campTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  campSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 20,
  },
  campBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  campBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 55) / 3,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  specialCard: {
    backgroundColor: '#002b47',
    borderColor: '#002b47',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  specialIconCircle: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  specialText: {
    color: '#fff',
  },
  transactionContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 5,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  txDate: {
    fontSize: 12,
  },
  txAmount: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
  },
  brandName: {
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 50,
    minHeight: 480,
  },
  modalHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  modalHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 10,
  },
  modalBody: {
    width: '100%',
    marginTop: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailBox: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#002b47',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});