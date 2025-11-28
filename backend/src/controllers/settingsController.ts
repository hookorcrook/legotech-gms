import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

/**
 * Get site settings (public endpoint)
 */
export const getSiteSettings = async (req: AuthRequest, res: Response) => {
  try {
    // Get the first (and should be only) site settings record
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Site settings not found',
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch site settings',
    });
  }
};

/**
 * Update site settings (admin only)
 */
export const updateSiteSettings = async (req: AuthRequest, res: Response) => {
  try {
    const {
      siteName,
      siteTagline,
      primaryColor,
      secondaryColor,
      accentColor,
      heroTitle,
      heroSubtitle,
      heroButtonText,
      aboutTitle,
      aboutDescription,
      contactEmail,
      contactPhone,
      contactAddress,
  mapLatitude,
  mapLongitude,
  mapEmbedUrl,
      mapZoom,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      youtubeUrl,
      businessHours,
    } = req.body;

    // Get the first settings record
    const existingSettings = await prisma.siteSettings.findFirst();

    if (!existingSettings) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Site settings not found',
      });
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {};
    
    if (siteName !== undefined) updateData.siteName = siteName;
    if (siteTagline !== undefined) updateData.siteTagline = siteTagline;
    if (primaryColor !== undefined) updateData.primaryColor = primaryColor;
    if (secondaryColor !== undefined) updateData.secondaryColor = secondaryColor;
    if (accentColor !== undefined) updateData.accentColor = accentColor;
    if (heroTitle !== undefined) updateData.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) updateData.heroSubtitle = heroSubtitle;
    if (heroButtonText !== undefined) updateData.heroButtonText = heroButtonText;
    if (aboutTitle !== undefined) updateData.aboutTitle = aboutTitle;
    if (aboutDescription !== undefined) updateData.aboutDescription = aboutDescription;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (contactAddress !== undefined) updateData.contactAddress = contactAddress;
  if (mapLatitude !== undefined) updateData.mapLatitude = mapLatitude;
  if (mapLongitude !== undefined) updateData.mapLongitude = mapLongitude;
  if (mapEmbedUrl !== undefined) updateData.mapEmbedUrl = mapEmbedUrl;
    if (mapZoom !== undefined) updateData.mapZoom = mapZoom;
    if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
    if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
    if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;
    if (businessHours !== undefined) updateData.businessHours = businessHours;

    // Update settings
    const updatedSettings = await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: updateData,
    });

    res.json({
      message: 'Site settings updated successfully',
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update site settings',
    });
  }
};
