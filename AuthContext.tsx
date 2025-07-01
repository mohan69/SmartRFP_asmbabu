import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompanyProfile {
  name: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    fax?: string;
  };
  business: {
    industry: string;
    founded?: string;
    employees?: string;
    registration?: string;
    taxId?: string;
  };
  social: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: string;
  avatar?: string;
  phone?: string;
  location?: string;
  website?: string;
  bio?: string;
  companyProfile?: CompanyProfile;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  refreshUser: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load user from localStorage
  const loadUserFromStorage = (): User | null => {
    try {
      const savedUser = localStorage.getItem('smartrfp_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        
        // Ensure company profile exists with default values
        if (!parsedUser.companyProfile) {
          parsedUser.companyProfile = createDefaultCompanyProfile(parsedUser);
        }
        
        // Ensure all required fields exist
        parsedUser.companyProfile = {
          ...createDefaultCompanyProfile(parsedUser),
          ...parsedUser.companyProfile,
          address: {
            ...createDefaultCompanyProfile(parsedUser).address,
            ...(parsedUser.companyProfile?.address || {})
          },
          contact: {
            ...createDefaultCompanyProfile(parsedUser).contact,
            ...(parsedUser.companyProfile?.contact || {})
          },
          business: {
            ...createDefaultCompanyProfile(parsedUser).business,
            ...(parsedUser.companyProfile?.business || {})
          },
          social: {
            ...createDefaultCompanyProfile(parsedUser).social,
            ...(parsedUser.companyProfile?.social || {})
          }
        };
        
        return parsedUser;
      }
    } catch (error) {
      console.error('Error parsing saved user data:', error);
      localStorage.removeItem('smartrfp_user');
    }
    return null;
  };

  // Function to save user to localStorage
  const saveUserToStorage = (userData: User): void => {
    try {
      localStorage.setItem('smartrfp_user', JSON.stringify(userData));
      console.log('User data saved to localStorage:', userData);
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  };

  // Function to create default company profile
  const createDefaultCompanyProfile = (userData: Partial<User>): CompanyProfile => {
    return {
      name: userData.company || '',
      logo: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      contact: {
        phone: userData.phone || '',
        email: userData.email || '',
        website: userData.website || '',
        fax: ''
      },
      business: {
        industry: 'Software Development',
        founded: '',
        employees: '',
        registration: '',
        taxId: ''
      },
      social: {
        linkedin: '',
        twitter: '',
        facebook: ''
      }
    };
  };

  // Function to refresh user data from localStorage
  const refreshUser = (): void => {
    const userData = loadUserFromStorage();
    if (userData) {
      setUser(userData);
      console.log('User data refreshed from localStorage');
    }
  };

  useEffect(() => {
    // Load user on component mount
    const userData = loadUserFromStorage();
    if (userData) {
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists in localStorage
      const existingUser = loadUserFromStorage();
      if (existingUser && existingUser.email === email) {
        setUser(existingUser);
        console.log('Logged in with existing user data');
        return true;
      }
      
      // Create new user if not exists
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        company: 'TechCorp Solutions',
        role: 'Business Development Manager',
        avatar: `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400`,
        phone: '+91 98765 43210',
        location: 'Bangalore, India',
        website: 'https://techcorp.com',
        bio: 'Experienced business development professional with 8+ years in software industry.',
        companyProfile: {
          name: 'TechCorp Solutions',
          logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
          address: {
            street: '123 Tech Park, Electronic City',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560100',
            country: 'India'
          },
          contact: {
            phone: '+91 80 4567 8900',
            email: 'info@techcorp.com',
            website: 'https://techcorp.com',
            fax: '+91 80 4567 8901'
          },
          business: {
            industry: 'Software Development',
            founded: '2016',
            employees: '50-100',
            registration: 'U72900KA2016PTC089123',
            taxId: 'AABCT1234C1Z5'
          },
          social: {
            linkedin: 'https://linkedin.com/company/techcorp-solutions',
            twitter: 'https://twitter.com/techcorp',
            facebook: 'https://facebook.com/techcorp'
          }
        }
      };
      
      setUser(mockUser);
      saveUserToStorage(mockUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        company: userData.company,
        role: userData.role,
        avatar: `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400`,
        phone: '',
        location: '',
        website: '',
        bio: '',
        companyProfile: createDefaultCompanyProfile(userData)
      };
      
      setUser(newUser);
      saveUserToStorage(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>): void => {
    if (user) {
      const updatedUser = { 
        ...user, 
        ...updates,
        // Preserve company profile if not being updated
        companyProfile: updates.companyProfile || user.companyProfile
      };
      
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
      
      console.log('User updated:', updatedUser);
      
      // Force a re-render by updating the state again
      setTimeout(() => {
        const savedUser = loadUserFromStorage();
        if (savedUser) {
          setUser({ ...savedUser });
        }
      }, 100);
    }
  };

  const updateCompanyProfile = (profileUpdates: Partial<CompanyProfile>): void => {
    if (user && user.companyProfile) {
      const updatedCompanyProfile = {
        ...user.companyProfile,
        ...profileUpdates,
        // Handle nested objects properly
        address: {
          ...user.companyProfile.address,
          ...(profileUpdates.address || {})
        },
        contact: {
          ...user.companyProfile.contact,
          ...(profileUpdates.contact || {})
        },
        business: {
          ...user.companyProfile.business,
          ...(profileUpdates.business || {})
        },
        social: {
          ...user.companyProfile.social,
          ...(profileUpdates.social || {})
        }
      };
      
      const updatedUser = {
        ...user,
        companyProfile: updatedCompanyProfile
      };
      
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
      
      console.log('Company profile updated:', updatedCompanyProfile);
      
      // Force a re-render by updating the state again
      setTimeout(() => {
        const savedUser = loadUserFromStorage();
        if (savedUser) {
          setUser({ ...savedUser });
        }
      }, 100);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartrfp_user');
    console.log('User logged out and data cleared');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser, 
      updateCompanyProfile,
      refreshUser,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};