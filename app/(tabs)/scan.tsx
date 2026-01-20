import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  lacivert: '#002b47',
  turuncu: '#ff5c36',
  beyaz: '#ffffff',
  arkaplan: '#f0f2f5',
  koyuMavi: '#115c96',
  griChat: '#e4e6eb', // AI balon rengi için
};

// Mesaj Tipi
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  type?: 'text' | 'analysis'; // Normal metin mi yoksa analiz kutusu mu?
}

export default function AIScreen() {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Başlangıç Mesajları (State içinde tutuluyor)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! 👋 Aracınla ilgili sana nasıl yardımcı olabilirim? Lastik basınçlarını kontrol etmemi ister misin?',
      isUser: false,
      type: 'text',
    },
  ]);

  // Mesaj Gönderme Fonksiyonu
  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    // 1. Kullanıcının mesajını ekle
    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      type: 'text',
    };

    setMessages((prev) => [...prev, userMsg]);
    const receivedText = inputText.toLowerCase();
    setInputText(''); // Inputu temizle

    // 2. AI Cevabını Simüle Et (1.5 sn gecikme ile)
    setTimeout(() => {
      let aiResponse: Message;

      // Basit Anahtar Kelime Kontrolü (Yapay Zeka Taklidi)
      if (receivedText.includes('lastik') || receivedText.includes('basınç')) {
        aiResponse = {
          id: Date.now().toString() + '_ai',
          text: 'Verileri analiz ediyorum...',
          isUser: false,
          type: 'analysis', // Bu tip, özel kutucuğu tetikleyecek
        };
      } else if (receivedText.includes('merhaba') || receivedText.includes('selam')) {
        aiResponse = {
          id: Date.now().toString() + '_ai',
          text: 'Selam! Bugün aracınla nereye gidiyoruz? 🚗',
          isUser: false,
          type: 'text',
        };
      } else {
        aiResponse = {
          id: Date.now().toString() + '_ai',
          text: 'Bunu not aldım. Araç sensörlerinden bu veriyi şu an çekemiyorum ama servis randevusu oluşturabilirim.',
          isUser: false,
          type: 'text',
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      
      // Mesaj gelince en alta kaydır
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    }, 1500);
  };

  // Her bir mesajın nasıl görüneceği (Render Item)
  const renderMessage = ({ item }: { item: Message }) => {
    if (item.isUser) {
      // KULLANICI MESAJI
      return (
        <View style={styles.userMessageRow}>
          <View style={styles.userBubble}>
            <Text style={[styles.messageText, { color: COLORS.beyaz }]}>{item.text}</Text>
          </View>
        </View>
      );
    }

    // AI MESAJI
    return (
      <View style={styles.aiMessageRow}>
        <View style={styles.aiAvatar}>
          <MaterialCommunityIcons name="robot-outline" size={20} color={COLORS.beyaz} />
        </View>
        <View style={styles.aiContentContainer}>
            {/* Eğer normal metinse */}
            {item.type === 'text' && (
                <View style={styles.aiBubble}>
                    <Text style={styles.messageText}>{item.text}</Text>
                </View>
            )}

            {/* Eğer Analiz Raporu ise (Özel Tasarım) */}
            {item.type === 'analysis' && (
                 <View style={styles.aiBubble}>
                    <Text style={styles.messageText}>Verileri analiz ediyorum... 🔍</Text>
                    <View style={styles.analysisBox}>
                        <Text style={styles.analysisTitle}>Lastik Durumu</Text>
                        <Text style={styles.analysisData}>Ön Sol: 28 PSI (Düşük ⚠️)</Text>
                        <Text style={styles.analysisData}>Ön Sağ: 34 PSI (Normal)</Text>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionBtnText}>En Yakın İstasyon</Text>
                        </TouchableOpacity>
                    </View>
                 </View>
            )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={[COLORS.lacivert, COLORS.koyuMavi]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.aiIconBox}>
             <MaterialCommunityIcons name="robot-excited-outline" size={24} color={COLORS.turuncu} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Araçta AI</Text>
            <Text style={styles.headerSubtitle}>Online • Hazır</Text>
          </View>
        </View>
      </LinearGradient>

      {/* CHAT LİSTESİ */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatListContent}
        style={styles.chatList}
      />

      {/* INPUT ALANI */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Tabbar yüksekliğine göre ayar
        style={styles.inputWrapper}
      >
        <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachBtn}>
                <Ionicons name="add" size={24} color={COLORS.lacivert} />
            </TouchableOpacity>
            
            <TextInput 
                value={inputText}
                onChangeText={setInputText}
                placeholder="Bir şeyler sor..." 
                style={styles.input}
                placeholderTextColor="#999"
                returnKeyType="send"
                onSubmitEditing={handleSend}
            />
            
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Ionicons name="send" size={20} color={COLORS.beyaz} />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.arkaplan,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconBox: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.beyaz,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4ade80', // Online yeşili
    fontWeight: 'bold',
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    padding: 20,
    paddingBottom: 100, // Klavye payı
  },
  aiMessageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  aiContentContainer: {
    maxWidth: '85%',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lacivert,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 0,
  },
  aiBubble: {
    backgroundColor: COLORS.beyaz,
    padding: 15,
    borderRadius: 20,
    borderTopLeftRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  userBubble: {
    backgroundColor: COLORS.turuncu,
    padding: 15,
    borderRadius: 20,
    borderBottomRightRadius: 5,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  analysisBox: {
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.turuncu,
  },
  analysisTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.lacivert,
  },
  analysisData: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  actionBtn: {
    marginTop: 8,
    backgroundColor: COLORS.lacivert,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  actionBtnText: {
    color: COLORS.beyaz,
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputWrapper: {
    padding: 15,
    backgroundColor: 'transparent',
    // Android'de input'un klavye üzerinde kalması için:
    marginBottom: Platform.OS === 'android' ? 10 : 0, 
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.beyaz,
    borderRadius: 30,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, // Gölgeyi yukarı verelim
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  attachBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: '#333',
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.turuncu,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});