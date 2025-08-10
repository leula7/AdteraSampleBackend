import { DataTypes } from 'sequelize';

const initFollowers = (sequelize) => {
  return sequelize.define('InfluencerSocialMedia', {
    followers_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for influencer social media records',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'influencers',  // adjust if your influencers table name differs
        key: 'id',
      },
      comment: 'Foreign key to influencer',
    },
    platform: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Social media platform name (e.g., Instagram, TikTok)',
    },
    followers_count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of followers on the platform',
    },
    profile_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'URL of the influencer social media profile',
    },
  }, {
    tableName: 'followers',
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
        name: 'idx_influencer_social_influencer',
      },
      {
        fields: ['platform'],
        name: 'idx_influencer_social_platform',
      },
    ],
    comment: 'Table storing influencers social media platforms, follower counts and profile links',
  });
};

export default initFollowers;
