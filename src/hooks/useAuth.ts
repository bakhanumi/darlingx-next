import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Хук для проверки авторизации и перенаправления пользователя
 * @param requireAuth Требуется ли авторизация для доступа к странице
 * @param redirectUrl URL для перенаправления, если условие не выполнено
 */
export function useAuth(
  requireAuth: boolean = true,
  redirectUrl: string = requireAuth ? '/login' : '/'
) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const isAuthenticated = !!session;
  const router = useRouter();
  
  // Перенаправляем пользователя, если условие не выполнено
  useEffect(() => {
    if (loading) return; // Не перенаправляем, пока идет загрузка сессии

    if (requireAuth && !isAuthenticated) {
      // Перенаправляем на страницу входа с callbackUrl
      router.push({
        pathname: redirectUrl,
        query: { callbackUrl: router.asPath },
      });
    } else if (!requireAuth && isAuthenticated) {
      // Перенаправляем на заданный URL (обычно главная страница)
      router.push(redirectUrl);
    }
  }, [loading, isAuthenticated, requireAuth, redirectUrl, router]);
  
  return { session, loading, isAuthenticated };
}

export default useAuth;
