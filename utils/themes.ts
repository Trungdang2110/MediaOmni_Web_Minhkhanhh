"use client";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

/**
 * Giao diện "Pyra Rococo" (nền giấy + khung vàng + kính lỏng).
 *
 * Mọi màu ở đây KHÔNG gõ mã màu rời: chúng trỏ tới biến CSS (token) trong
 * `styles/design-system/tokens.css`. Nhờ vậy khi bật chế độ tối, toàn bộ
 * màu tự đổi theo mà không cần sửa từng nơi.
 *
 * Chakra UI vẫn là "bộ động cơ" dựng giao diện; file này chỉ dạy nó
 * cách ăn mặc theo design system.
 */
const config: ThemeConfig = {
   initialColorMode: "system",
   useSystemColorMode: true,
};

const v = (name: string) => `var(--${name})`;

const colors = {
   paper: v("paper"),
   paperDeep: v("paper-deep"),
   ink: v("ink"),
   inkMuted: v("ink-muted"),
   claret: v("claret"),
   claretFill: v("claret-fill"),
   claretDeep: v("claret-deep"),
   onClaret: v("on-claret"),
   powder: v("powder"),
   onPowder: v("on-powder"),
   peach: v("peach"),
   onPeach: v("on-peach"),
   gold: v("gold"),
   line: v("line"),
   success: v("success"),
   danger: v("danger"),
   onGlass: v("on-glass"),
   onGlassMuted: v("on-glass-muted"),
   glassFill: v("glass-fill"),
   glassFillStrong: v("glass-fill-strong"),
   glassChip: v("glass-chip"),
   glassStroke: v("glass-stroke"),
   // Các thang màu cũ của ứng dụng (brand / orange) được "đổi áo" sang token,
   // để mã cũ còn dùng `brand.500` hay `colorScheme="orange"` vẫn ra đúng tông Pyra.
   brand: {
      50: v("paper-deep"),
      100: v("line"),
      200: v("peach"),
      300: v("gold"),
      400: v("claret"),
      500: v("claret"),
      600: v("claret"),
      700: v("claret-deep"),
      800: v("claret-deep"),
      900: v("claret-deep"),
   },
   orange: {
      50: v("paper-deep"),
      100: v("line"),
      200: v("peach"),
      300: v("gold"),
      400: v("claret"),
      500: v("claret-fill"),
      600: v("claret-fill"),
      700: v("claret-deep"),
      800: v("claret-deep"),
      900: v("claret-deep"),
   },
};

// Các thang màu Chakra khác còn được mã cũ dùng qua `colorScheme="red" | "green" | ...`
// → cũng "đổi áo" sang token để không lọt màu ngoài bảng màu Pyra.
const scale = (light: string, mid: string, deep: string) => ({
   50: v("paper-deep"),
   100: v("paper-deep"),
   200: v("line"),
   300: light,
   400: mid,
   500: mid,
   600: mid,
   700: deep,
   800: deep,
   900: deep,
});
Object.assign(colors, {
   red: scale(v("peach"), v("danger"), v("claret-deep")),
   green: scale(v("powder"), v("success"), v("success")),
   blue: scale(v("powder"), v("on-powder"), v("on-powder")),
   teal: scale(v("powder"), v("on-powder"), v("on-powder")),
   cyan: scale(v("powder"), v("on-powder"), v("on-powder")),
   purple: scale(v("peach"), v("claret"), v("claret-deep")),
   pink: scale(v("peach"), v("claret"), v("claret-deep")),
   yellow: scale(v("peach"), v("gold"), v("gold")),
});

const fonts = {
   heading: v("font-display"),
   body: v("font-text"),
};

const glassSurface = {
   bg: v("glass-fill-strong"),
   color: v("on-glass"),
   backdropFilter: "blur(24px) saturate(160%)",
   WebkitBackdropFilter: "blur(24px) saturate(160%)",
   border: "1px solid var(--glass-stroke)",
   borderRadius: v("radius-glass"),
   boxShadow:
      "inset 0 1px 0 var(--glass-highlight), inset 0 -1px 0 rgba(0,0,0,.12), var(--shadow-glass)",
   fontFamily: v("font-ui"),
};

const components = {
   Button: {
      baseStyle: {
         fontFamily: v("font-ui"),
         fontWeight: 600,
         letterSpacing: ".02em",
         borderRadius: v("radius-sm"),
         minH: "44px",
         lineHeight: "20px",
         transition: "filter .15s, transform .05s",
         _hover: { filter: "brightness(.92)", _disabled: { filter: "none" } },
         _active: { transform: "translateY(1px)" },
         _focusVisible: {
            outline: "2px solid var(--gold)",
            outlineOffset: "2px",
            boxShadow: "none",
         },
         _disabled: { opacity: 0.45, cursor: "not-allowed" },
      },
      sizes: {
         xs: { h: "36px", minH: "36px", px: 3, fontSize: "13px" },
         sm: { h: "40px", minH: "40px", px: 4, fontSize: "14px" },
         md: { h: "auto", minH: "44px", px: "22px", py: 3, fontSize: "15px" },
         lg: { h: "auto", minH: "48px", px: 7, py: 3, fontSize: "16px" },
      },
      variants: {
         // Primary: đỏ rượu + viền vàng mảnh bên trong (mỗi màn hình tối đa 1 nút)
         solid: {
            bg: v("claret-fill"),
            color: v("on-claret"),
            boxShadow: "inset 0 0 0 3px var(--claret-fill), inset 0 0 0 4px var(--gold)",
            _hover: { bg: v("claret-fill"), _disabled: { bg: v("claret-fill") } },
         },
         // Ticket: xanh phấn, hoa văn ‹ › hai bên
         ticket: {
            bg: v("powder"),
            color: v("on-powder"),
            _before: { content: '"‹"', fontFamily: v("font-display"), fontSize: "20px", lineHeight: 1, mr: 2 },
            _after: { content: '"›"', fontFamily: v("font-display"), fontSize: "20px", lineHeight: 1, ml: 2 },
         },
         // Ghost (viền đỏ): hành động phụ
         outline: {
            bg: "transparent",
            color: v("claret"),
            border: "1px solid var(--claret)",
            _hover: { bg: "transparent" },
         },
         // Text link
         ghost: {
            bg: "transparent",
            color: v("claret"),
            _hover: { bg: "transparent", textDecoration: "underline" },
         },
         link: {
            bg: "none",
            color: v("claret"),
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            px: 1,
            minH: "44px",
            h: "auto",
            _hover: { textDecoration: "underline" },
         },
         danger: {
            bg: "transparent",
            color: v("danger"),
            border: "1px solid var(--danger)",
         },
         // Nút icon vuông 44px trên nền giấy
         icon: {
            bg: v("paper-deep"),
            color: v("ink"),
            border: "1px solid var(--line)",
            w: "44px",
            minW: "44px",
            p: 0,
         },
         // Nút kính (trên tranh / trong tấm kính)
         glass: {
            color: v("on-glass"),
            bg: v("glass-chip"),
            border: "1px solid var(--glass-stroke)",
            borderRadius: v("radius-pill"),
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            boxShadow: "inset 0 1px 0 var(--glass-highlight)",
            transition: "transform .25s cubic-bezier(.2,.9,.25,1.15), background .2s",
            _hover: { bg: "rgba(255,244,230,.24)", filter: "none" },
            _active: { transform: "scale(.94)" },
            _focusVisible: { outline: "2px solid var(--gold)", outlineOffset: "3px" },
         },
         glassAccent: {
            color: v("on-glass"),
            bg: "rgba(123,36,22,.72)",
            border: "1px solid rgba(255,220,200,.35)",
            borderRadius: v("radius-pill"),
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            boxShadow: "inset 0 1px 0 var(--glass-highlight)",
            transition: "transform .25s cubic-bezier(.2,.9,.25,1.15), background .2s",
            _hover: { bg: "rgba(123,36,22,.85)", filter: "none" },
            _active: { transform: "scale(.94)" },
         },
      },
      defaultProps: { variant: "solid", size: "md", colorScheme: "orange" },
   },

   Input: {
      variants: {
         outline: {
            field: {
               fontFamily: v("font-ui"),
               fontSize: "16px",
               color: v("ink"),
               bg: v("paper-deep"),
               border: "1px solid var(--line)",
               borderBottom: "2px solid var(--claret)",
               borderRadius: v("radius-sm"),
               minH: "44px",
               _placeholder: { color: v("ink-muted") },
               _focusVisible: { outline: "2px solid var(--gold)", outlineOffset: "2px", boxShadow: "none" },
               _invalid: { borderColor: v("danger"), borderBottomColor: v("danger"), boxShadow: "none" },
            },
         },
      },
      sizes: {
         md: { field: { h: "auto", px: 3, py: "10px" } },
         sm: { field: { h: "40px", px: 3 } },
      },
      defaultProps: { variant: "outline" },
   },
   Textarea: {
      variants: {
         outline: {
            fontFamily: v("font-ui"),
            fontSize: "16px",
            color: v("ink"),
            bg: v("paper-deep"),
            border: "1px solid var(--line)",
            borderBottom: "2px solid var(--claret)",
            borderRadius: v("radius-sm"),
            _placeholder: { color: v("ink-muted") },
            _focusVisible: { outline: "2px solid var(--gold)", outlineOffset: "2px", boxShadow: "none" },
            _invalid: { borderColor: v("danger"), boxShadow: "none" },
         },
      },
      defaultProps: { variant: "outline" },
   },
   Select: {
      variants: {
         outline: {
            field: {
               fontFamily: v("font-ui"),
               color: v("ink"),
               bg: v("paper-deep"),
               border: "1px solid var(--line)",
               borderBottom: "2px solid var(--claret)",
               borderRadius: v("radius-sm"),
               minH: "44px",
               _focusVisible: { outline: "2px solid var(--gold)", outlineOffset: "2px", boxShadow: "none" },
            },
         },
      },
   },
   FormError: {
      baseStyle: { text: { fontFamily: v("font-ui"), fontSize: "13px", color: v("danger") } },
   },
   FormLabel: {
      baseStyle: { fontFamily: v("font-ui"), fontSize: "13px", fontWeight: 500, color: v("ink-muted"), mb: "6px" },
   },

   Modal: {
      baseStyle: {
         overlay: {
            bg: v("scrim"),
            backdropFilter: "blur(3px)",
         },
         dialog: {
            ...glassSurface,
         },
         header: {
            fontFamily: v("font-display"),
            fontWeight: 700,
            fontSize: { base: "24px", md: "30px" },
            lineHeight: 1.15,
            color: v("on-glass"),
            pr: 14,
         },
         closeButton: {
            top: 3,
            right: 3,
            w: "44px",
            h: "44px",
            borderRadius: v("radius-pill"),
            color: v("on-glass"),
            bg: v("glass-chip"),
            border: "1px solid var(--glass-stroke)",
            _hover: { bg: "rgba(255,244,230,.24)" },
            _focusVisible: { outline: "2px solid var(--gold)", outlineOffset: "3px", boxShadow: "none" },
         },
         body: { fontFamily: v("font-text"), fontSize: "17px", color: v("on-glass") },
         footer: { fontFamily: v("font-ui") },
      },
      defaultProps: { motionPreset: "none" },
   },
   Drawer: {
      baseStyle: {
         overlay: { bg: v("scrim"), backdropFilter: "blur(3px)" },
         dialog: { ...glassSurface, borderRadius: 0 },
         header: { fontFamily: v("font-display"), fontWeight: 700, color: v("on-glass") },
         closeButton: {
            w: "44px",
            h: "44px",
            borderRadius: v("radius-pill"),
            color: v("on-glass"),
            _focusVisible: { outline: "2px solid var(--gold)", boxShadow: "none" },
         },
         body: { color: v("on-glass") },
      },
   },
   Menu: {
      baseStyle: {
         list: { ...glassSurface, borderRadius: v("radius-glass-inner"), py: 2, minW: "200px", zIndex: 1500 },
         item: {
            bg: "transparent",
            color: v("on-glass"),
            fontFamily: v("font-ui"),
            minH: "44px",
            _hover: { bg: v("glass-chip") },
            _focus: { bg: v("glass-chip") },
         },
      },
   },
   Popover: {
      baseStyle: {
         content: { ...glassSurface, borderRadius: v("radius-glass-inner"), _focusVisible: { boxShadow: "none" } },
         header: { borderColor: v("glass-stroke") },
         arrow: { bg: "transparent !important" },
      },
   },
   Tooltip: {
      baseStyle: {
         bg: v("claret-deep"),
         color: v("on-claret"),
         fontFamily: v("font-ui"),
         fontSize: "13px",
         borderRadius: v("radius-sm"),
         px: 3,
         py: 2,
         "--popper-arrow-bg": "var(--claret-deep)",
      },
   },
   Badge: {
      baseStyle: {
         fontFamily: v("font-caps"),
         fontWeight: 700,
         letterSpacing: ".06em",
         borderRadius: v("radius-pill"),
         textTransform: "none",
         px: 3,
         py: "3px",
         bg: "transparent",
         color: v("ink"),
         border: "1px solid var(--gold)",
      },
   },
   Alert: {
      variants: {
         solid: { container: { bg: v("claret-deep"), color: v("on-claret"), borderRadius: v("radius-sm"), fontFamily: v("font-ui") } },
         subtle: { container: { bg: v("claret-deep"), color: v("on-claret"), borderRadius: v("radius-sm"), fontFamily: v("font-ui") } },
         "left-accent": { container: { bg: v("claret-deep"), color: v("on-claret"), borderRadius: v("radius-sm"), fontFamily: v("font-ui") } },
      },
   },
   Spinner: { baseStyle: { color: v("claret") }, defaultProps: { color: "claret" } },
   Divider: { baseStyle: { borderColor: v("line"), opacity: 1 } },
   Heading: { baseStyle: { fontFamily: v("font-display"), fontWeight: 700 } },
   Link: { baseStyle: { _hover: { textDecoration: "underline" } } },
};

const styles = {
   global: {
      html: { bg: v("paper") },
      body: {
         bg: v("paper"),
         color: v("ink"),
         fontFamily: v("font-text"),
         fontSize: "17px",
         lineHeight: 1.6,
      },
      "*:focus-visible": { outline: "2px solid var(--gold)", outlineOffset: "2px" },
   },
};

export const theme = extendTheme({
   config,
   colors,
   fonts,
   components,
   styles,
   semanticTokens: {},
});
