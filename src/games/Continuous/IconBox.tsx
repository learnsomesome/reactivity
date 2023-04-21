import { Box, Fade, IconButton, Text } from "@chakra-ui/react";
import { ICONS_MAP } from ".";
import { useEffect, useMemo, useState } from "react";
import { getRandomIntNumber } from "../../util";

// unit => ms
const DISPLAY_DURATION = 500;
const DISPLAY_TIME = 2000;

export const IconBox = ({
  no,
  rightNo,
  score,
  index,
  onIconClick,
  onProgress,
  onTestEnded,
}: {
  no: string;
  rightNo: string;
  score: number;
  index: number;
  onIconClick: (score: number) => void;
  onProgress: (progress: number) => void;
  onTestEnded: () => void;
}) => {
  const area = document.querySelector(".game-area");
  const isRightIcon = no === rightNo;
  const iconData = ICONS_MAP.find((item) => item.no === no);
  const [show, setShow] = useState<boolean>();
  const [showFeedBack, setShowFeedBack] = useState(false);

  const renderStyle: any = useMemo(() => {
    if (area) {
      const x = getRandomIntNumber(0, area.clientWidth - 48);
      const y = getRandomIntNumber(24, area.clientHeight - 48);

      return {
        position: "absolute",
        left: x + "px",
        top: y + "px",
      };
    }

    return {};
  }, [area]);

  const onClick = () => {
    setShowFeedBack(true);
    setShow(false);

    const feedBackTimer = setTimeout(() => {
      setShowFeedBack(false);
      clearTimeout(feedBackTimer);
    }, 500);

    onIconClick(isRightIcon ? score + 1 : score - 1);
    onTestEnded();
  };

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShow(true);

      const hiddenTimer = setTimeout(() => {
        setShow(false);
        clearTimeout(showTimer);
        clearTimeout(hiddenTimer);
        onTestEnded();
      }, DISPLAY_TIME);
    }, DISPLAY_DURATION * index);

    return () => clearTimeout(showTimer);
  }, [index]);

  useEffect(() => {
    if (show === false) {
      onProgress(index);
    }
  }, [show]);

  return (
    <Box style={renderStyle}>
      <Fade unmountOnExit in={show}>
        <IconButton
          w="48px"
          h="48px"
          colorScheme={iconData?.colorScheme}
          aria-label="Choosed icon"
          icon={iconData?.icon}
          onClick={onClick}
        />
      </Fade>
      <Fade
        unmountOnExit
        style={{ position: "absolute", left: 12, top: 6 }}
        in={showFeedBack}
      >
        <Text as="b" color={isRightIcon ? "teal" : "red"} fontSize={24}>
          {isRightIcon ? "+1" : "-1"}
        </Text>
      </Fade>
    </Box>
  );
};
