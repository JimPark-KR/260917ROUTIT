import React, { useRef, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { RoutineCameraScreenProps } from './types';

export function RoutineCameraScreen({ visible, onCapture, onClose }: RoutineCameraScreenProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isTaking, setIsTaking] = useState(false);

  if (!visible) return null;

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isTaking) return;
    setIsTaking(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      // TODO: Firebase Storage에 업로드 후 다운로드 URL을 사용하도록 교체 (현재는 로컬 URI 그대로 사용)
      onCapture(photo.uri);
    } finally {
      setIsTaking(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {!permission ? (
          <ActivityIndicator style={StyleSheet.absoluteFill} />
        ) : !permission.granted ? (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>루틴 인증 사진을 찍으려면{'\n'}카메라 권한이 필요해요</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>권한 허용하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelLink} onPress={onClose}>
              <Text style={styles.cancelLinkText}>취소</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
            <View style={styles.controls}>
              <TouchableOpacity style={styles.sideButton} onPress={onClose}>
                <Text style={styles.sideButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shutterButton}
                onPress={handleTakePhoto}
                disabled={isTaking}
              >
                {isTaking ? <ActivityIndicator color="#fff" /> : <View style={styles.shutterInner} />}
              </TouchableOpacity>
              <View style={styles.sideButton} />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  permissionText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#FFB84C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  permissionButtonText: {
    color: '#2A2A2A',
    fontWeight: '700',
  },
  cancelLink: {
    marginTop: 16,
  },
  cancelLinkText: {
    color: '#B0B0B0',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  sideButton: {
    width: 60,
    alignItems: 'center',
  },
  sideButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
});
