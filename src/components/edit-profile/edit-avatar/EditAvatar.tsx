import Avatar from "@/components/avatar/Avatar";
import styles from "./EditAvatar.module.scss";
import Button from "@/components/button/Button";
import { useRef, useState } from "react";
import { uploadProfilePicture } from "@/services/profile-picture/uploadProfilePicture";
import { createClient } from "@/lib/supabase/client";

type EditAvatarProps = {
  avatar?: string | null;
};

const EditAvatar: React.FC<EditAvatarProps> = ({ avatar }) => {
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

  return (
    <div className={styles.editAvatar}>
      <div className={styles.header}>
        <p>Profile Photo</p>
        <span>Shown on your profile and next to your sessions</span>
      </div>

      <div className={styles.content}>
        <div className={styles.avatarContainer}>
          <Avatar src={preview || avatar} size="large" />
        </div>

        <Button variant="lessonCard" onClick={handleClickUpload}>
          Upload photo
        </Button>

        <Button variant="secondary">Remove</Button>

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
