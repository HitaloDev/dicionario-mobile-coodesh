import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { styles } from './styles/_layout';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: '#5956E9',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: styles.tabBar,
        tabBarIndicatorStyle: styles.tabIndicator,
        tabBarLabelStyle: styles.tabLabel,
      }}
      style={styles.container}
    >
      <MaterialTopTabs.Screen
        name="word-list"
        options={{
          title: 'Lista de Palavras',
        }}
      />
      <MaterialTopTabs.Screen
        name="history-screen"
        options={{
          title: 'Histórico',
        }}
      />
      <MaterialTopTabs.Screen
        name="favorites-screen"
        options={{
          title: 'Favoritos',
        }}
      />
    </MaterialTopTabs>
  );
}
