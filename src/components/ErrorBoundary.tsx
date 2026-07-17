import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Captura erros de renderização em qualquer parte da árvore de componentes
 * (incluindo falhas silenciosas de AsyncStorage) e exibe uma tela de fallback
 * em vez de quebrar o app com uma tela em branco.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Em produção, aqui entraria um serviço de crash reporting.
    console.error('[ErrorBoundary] Erro capturado:', error, info);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
  }
}

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Ops! Algo deu errado</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        Ocorreu um erro inesperado. Você pode tentar novamente.
      </Text>
      {error?.message ? (
        <Text style={[styles.detail, { color: theme.textSecondary }]}>{error.message}</Text>
      ) : null}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={onReset}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Tentar novamente"
      >
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  detail: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
