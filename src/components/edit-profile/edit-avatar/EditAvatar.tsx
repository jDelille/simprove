import styles from "./EditAvatar.module.scss";
import { useRef, useState } from "react";
import { uploadProfilePicture } from "@/services/profile-picture/uploadProfilePicture";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/ui/avatar/Avatar";
import Button from "@/components/ui/button/Button";
import { deleteProfilePicture } from "@/services/profile-picture/deleteProfilePicture";

type EditAvatarProps = {
  avatar?: string | null;
  userId: string;
  initials: string;
  color: string;
};

const EditAvatar: React.FC<EditAvatarProps> = ({ avatar, userId, initials, color }) => {
  const [preview, setPreview] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await uploadProfilePicture({
      userId: user?.id,
      file,
    });
  };

  const handleRemove = async () => {
    await deleteProfilePicture({
      userId: userId,
      avatarPath: avatar,
      supabaseClient: supabase,
    });
  };

  return (
    <div className={styles.editAvatar}>
      <div className={styles.header}>
        <p>Profile Photo</p>
        <span>Shown on your profile and next to your sessions</span>
      </div>

      <div className={styles.content}>
        <div className={styles.avatarContainer}>
          <Avatar src={preview || avatar} size="large" initials={initials} color={color} />
        </div>

        <Button variant="lessonCard" onClick={handleClickUpload}>
          Upload photo
        </Button>

        <Button variant="secondary" onClick={handleRemove}>
          Remove
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default EditAvatar;
