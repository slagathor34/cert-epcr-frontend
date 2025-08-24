import axios from 'axios';
import { Member, MemberListResponse, MemberResponse, MemberStatsResponse, MemberFormData, MemberFilters } from '../types/member';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class MemberService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get all members with filtering and pagination
  async getMembers(filters: MemberFilters = {}): Promise<MemberListResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${API_BASE_URL}/members?${params}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw this.handleError(error);
    }
  }

  // Get single member by ID
  async getMember(id: string): Promise<MemberResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/members/${id}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching member:', error);
      throw this.handleError(error);
    }
  }

  // Create new member
  async createMember(memberData: MemberFormData): Promise<MemberResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/members`, memberData, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating member:', error);
      throw this.handleError(error);
    }
  }

  // Update member
  async updateMember(id: string, memberData: Partial<MemberFormData>): Promise<MemberResponse> {
    try {
      const response = await axios.put(`${API_BASE_URL}/members/${id}`, memberData, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating member:', error);
      throw this.handleError(error);
    }
  }

  // Update member certification
  async updateCertification(
    memberId: string, 
    certType: string, 
    certificationData: {
      certification: string;
      isCompleted: boolean;
      dateCompleted?: string;
    }
  ): Promise<MemberResponse> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/members/${memberId}/certifications/${certType}`,
        certificationData,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating certification:', error);
      throw this.handleError(error);
    }
  }

  // Add event participation
  async addEventParticipation(
    memberId: string,
    eventData: {
      eventName: string;
      eventDate: string;
      eventType: string;
      hoursServed?: number;
      role?: string;
      notes?: string;
    }
  ): Promise<MemberResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/members/${memberId}/events`,
        eventData,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error adding event participation:', error);
      throw this.handleError(error);
    }
  }

  // Assign equipment
  async assignEquipment(
    memberId: string,
    equipmentData: {
      itemId: string;
      itemName: string;
      serialNumber?: string;
      condition?: string;
      notes?: string;
    }
  ): Promise<MemberResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/members/${memberId}/equipment`,
        equipmentData,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error assigning equipment:', error);
      throw this.handleError(error);
    }
  }

  // Add note to member
  async addNote(
    memberId: string,
    noteData: {
      content: string;
      type?: string;
    }
  ): Promise<MemberResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/members/${memberId}/notes`,
        noteData,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw this.handleError(error);
    }
  }

  // Get member statistics
  async getMemberStats(): Promise<MemberStatsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/members/stats`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching member stats:', error);
      throw this.handleError(error);
    }
  }

  // Deactivate member
  async deactivateMember(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/members/${id}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error deactivating member:', error);
      throw this.handleError(error);
    }
  }

  // Search members by various criteria
  async searchMembers(searchTerm: string): Promise<MemberListResponse> {
    try {
      return await this.getMembers({
        search: searchTerm,
        limit: 50 // Return more results for search
      });
    } catch (error) {
      console.error('Error searching members:', error);
      throw this.handleError(error);
    }
  }

  // Get members by certification level
  async getMembersByCertification(certificationLevel: string): Promise<MemberListResponse> {
    try {
      return await this.getMembers({
        certificationLevel,
        limit: 100
      });
    } catch (error) {
      console.error('Error fetching members by certification:', error);
      throw this.handleError(error);
    }
  }

  // Get field ready members only
  async getFieldReadyMembers(): Promise<MemberListResponse> {
    try {
      return await this.getMembers({
        fieldReadyOnly: true,
        limit: 100
      });
    } catch (error) {
      console.error('Error fetching field ready members:', error);
      throw this.handleError(error);
    }
  }

  // Helper method to handle API errors
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        const message = error.response.data?.message || 'Server error occurred';
        return new Error(message);
      } else if (error.request) {
        // Network error
        return new Error('Unable to connect to server. Please check your connection.');
      }
    }
    
    // Generic error
    return new Error('An unexpected error occurred');
  }

  // Format member display name
  static formatMemberName(member: Member): string {
    if (member.nickname) {
      return `${member.firstName} "${member.nickname}" ${member.lastName}`;
    }
    return `${member.firstName} ${member.lastName}`;
  }

  // Calculate certification completion percentage
  static getCertificationPercentage(summary: any): number {
    if (!summary || summary.total === 0) return 0;
    return Math.round((summary.completed / summary.total) * 100);
  }

  // Get status color for UI display
  static getStatusColor(status: string): string {
    switch (status) {
      case 'Field Ready':
        return 'success';
      case 'Active':
        return 'info';
      case 'In Training':
        return 'warning';
      case 'Suspended':
        return 'error';
      case 'Inactive':
        return 'default';
      default:
        return 'default';
    }
  }

  // Format phone number for display
  static formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone; // Return original if not 10 digits
  }

  // Check if certification is expiring soon (within 30 days)
  static isCertificationExpiringSoon(expirationDate?: string): boolean {
    if (!expirationDate) return false;
    
    const expDate = new Date(expirationDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return expDate <= thirtyDaysFromNow && expDate >= now;
  }

  // Check if certification is expired
  static isCertificationExpired(expirationDate?: string): boolean {
    if (!expirationDate) return false;
    
    const expDate = new Date(expirationDate);
    const now = new Date();
    
    return expDate < now;
  }
}

export { MemberService };
export default new MemberService();