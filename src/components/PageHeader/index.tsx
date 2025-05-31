
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';
import styles from './index.module.css';

const PageHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <img src="/lovable-uploads/af00c1ef-8d89-4eea-83f4-48c40d2bad90.png" alt="infinitheism" className={styles.logoImage} />
        </div>
        
        <div className={styles.indicators}>
          <div className={styles.indicator}></div>
          <div className={styles.indicator}></div>
          <div className={styles.indicator}></div>
        </div>
        
        <div className={styles.actions}>
          <Button variant="ghost" size="icon">
            <Bell size={20} className={styles.notificationIcon} />
          </Button>
          <div className={styles.avatar}>
            <User size={20} className={styles.avatarIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
