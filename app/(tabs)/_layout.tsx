import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

// --- RENK PALETİ ---
const COLORS = {
  primary: '#002b47',       // Lacivert
  secondary: '#ff5c36',     // Turuncu
  inactive: '#94a3b8',      // Soluk Gri (Pasif ikonlar için)
  bg: '#ffffff',
  
  // Active Pill (Elips) Arkaplan Renkleri
  activeBluePill: '#e3f2fd',   // Açık Mavi (Normal tablar için)
  activeOrangePill: '#fff3e0', // Açık Turuncu (AI için)
};

// --- ÖZEL HEADER ---
const CustomHeader = () => (
  <SafeAreaView style={styles.headerSafeArea}>
    <View style={styles.headerContainer}>
      <Image 
        source={require('../../assets/images/logo.webp')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <View style={styles.headerRight}>
         <TouchableOpacity style={styles.iconBtn}>
           <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
           <View style={styles.badge} />
         </TouchableOpacity>
         <TouchableOpacity>
           <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
              style={styles.avatar} 
           />
         </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);

export default function TabLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Tabs
        screenOptions={{
          header: () => <CustomHeader />,
          headerShown: true,
          tabBarShowLabel: false, // Yazıları kapattık
          
          // --- TAB BAR STİLİ ---
          tabBarStyle: {
            backgroundColor: COLORS.bg,
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
            height: Platform.OS === 'ios' ? 90 : 70, 
            paddingTop: 10,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      >
        {/* 1. ANA SAYFA */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.pillContainer, focused && { backgroundColor: COLORS.activeBluePill }]}>
                <Ionicons 
                  name={focused ? "home" : "home-outline"} 
                  size={24} 
                  color={focused ? COLORS.primary : COLORS.inactive} 
                />
              </View>
            ),
          }}
        />

        {/* 2. GARAJIM */}
        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.pillContainer, focused && { backgroundColor: COLORS.activeBluePill }]}>
                <Ionicons 
                  name={focused ? "car-sport" : "car-sport-outline"} 
                  size={26} 
                  color={focused ? COLORS.primary : COLORS.inactive} 
                />
              </View>
            ),
          }}
        />

        {/* 3. AI ASİSTAN (Seçilince Turuncu Elips) */}
        <Tabs.Screen
          name="scan"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.pillContainer, focused && { backgroundColor: COLORS.activeOrangePill }]}>
                 {/* Robot ikonu: Seçiliyken Turuncu, değilken Gri */}
                 <MaterialCommunityIcons 
                    name={focused ? "robot-excited" : "robot-outline"} 
                    size={26} 
                    color={focused ? COLORS.secondary : COLORS.inactive} 
                 />
              </View>
            ),
          }}
        />

        {/* 4. PROFİL */}
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.pillContainer, focused && { backgroundColor: COLORS.activeBluePill }]}>
                <Ionicons 
                  name={focused ? "person" : "person-outline"} 
                  size={24} 
                  color={focused ? COLORS.primary : COLORS.inactive} 
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  // HEADER
  headerSafeArea: { backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logo: { width: 100, height: 35 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary, borderWidth: 1, borderColor: '#fff' },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#f0f0f0' },

  // --- PILL (ELİPS) STİLİ ---
  pillContainer: {
    width: 60,            // Sabit genişlik (ikonun etrafı)
    height: 40,           // Elips yüksekliği
    borderRadius: 20,     // Tam yuvarlak kenarlar
    alignItems: 'center',
    justifyContent: 'center',
    // Varsayılan olarak şeffaf, focused olunca inline style ile renkleniyor
  },
});