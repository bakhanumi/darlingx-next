import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getSession } from 'next-auth/react';

interface WithAuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * HOC для защиты маршрутов на уровне сервера
 * @param options Настройки защиты
 * @param gssp Исходная getServerSideProps функция (если есть)
 */
export function withAuth<P>(
  options: WithAuthOptions = { requireAuth: true, redirectTo: '/login' },
  gssp?: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const { req } = context;
    const session = await getSession({ req });
    
    const { requireAuth = true, redirectTo = requireAuth ? '/login' : '/' } = options;
    
    // Если требуется авторизация, но пользователь не авторизован
    if (requireAuth && !session) {
      return {
        redirect: {
          destination: `${redirectTo}?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false,
        },
      };
    }
    
    // Если НЕ требуется авторизация, но пользователь авторизован
    if (!requireAuth && session) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: false,
        },
      };
    }
    
    // Если есть оригинальная getServerSideProps функция, выполняем ее
    if (gssp) {
      return gssp(context);
    }
    
    // Иначе возвращаем пустые props
    return {
      props: {} as P,
    };
  };
}

/**
 * HOC для защиты компонентов на стороне клиента
 * @param Component Защищаемый компонент
 * @param options Настройки защиты
 */
export function withAuthComponent<P>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = { requireAuth: true }
): React.FC<P> {
  const { requireAuth = true } = options;
  
  const WithAuthComponent: React.FC<P> = (props) => {
    // Здесь можно добавить логику проверки авторизации на клиенте
    // и показать UI загрузки или перенаправления
    
    return <Component {...props} />;
  };
  
  WithAuthComponent.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;
  
  return WithAuthComponent;
}

export default withAuth;
