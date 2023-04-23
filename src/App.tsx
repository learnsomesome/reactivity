import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Continuous, Sudden } from "./games";
import { Github, LightSun, DarkMoon } from "./assets/icons";

const GAMES_MAP = [
  {
    key: "sudden",
    title: "😼 Sudden Reaction",
    description: "Click on the screen when the background color changes.",
    component: <Sudden />,
  },
  {
    key: "continuous",
    title: "🦉 Continuous Reaction",
    description:
      "Click on the right icon that continues to appear on the screen.",
    component: <Continuous />,
  },
];

function App() {
  const [key, setKey] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  const game = useMemo(() => GAMES_MAP.find((item) => item.key === key), [key]);

  return (
    <Box h="100vh" pb={16}>
      {key ? (
        <Box height="100%">
          <Flex h="80px" p={4} align="center" justify="space-between">
            <Button mr={4} colorScheme="blue" onClick={() => setKey("")}>
              Back
            </Button>
            <Text>{game?.description}</Text>
          </Flex>
          <Divider />
          <Box h="calc(100vh - 82px)">{game?.component}</Box>
        </Box>
      ) : (
        <Flex height="100%" direction="column" align="center" justify="center">
          <Stack
            position="absolute"
            top={4}
            right={4}
            direction="row"
            spacing={4}
          >
            <IconButton
              title="GitHub"
              aria-label="GitHub"
              icon={<Github fontSize={20} />}
              onClick={() => window.open("https://github.com/learnsomesome")}
            />
            <IconButton
              title="Toggle Color Theme"
              aria-label="Toggle Color Theme"
              icon={
                colorMode === "light" ? (
                  <DarkMoon fontSize={20} />
                ) : (
                  <LightSun fontSize={20} />
                )
              }
              onClick={toggleColorMode}
            />
          </Stack>
          <Heading>Reactivity</Heading>
          <Flex mt={12} direction="column">
            {GAMES_MAP.map(({ key, title }) => (
              <Button key={key} w="200px" mt={4} onClick={() => setKey(key)}>
                {title}
              </Button>
            ))}
          </Flex>
        </Flex>
      )}
    </Box>
  );
}

export default App;
